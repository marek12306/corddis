import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, ErrorType, GetGatewayType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import { EventEmitter, LRU } from "../../deps.ts"
import { UserType, StatusType } from "./../types/user.ts"
import { GuildType, InviteType } from "./../types/guild.ts"
import { IntentHandler } from "./intentHandler.ts";
import IntentHandlers from "../intents/index.ts"
import { Invite } from "../structures/invite.ts";

/** Client which communicates with gateway and manages REST API communication. */
class Client extends EventEmitter {
    token: string;
    user: User | null = null;
    gatewayData: GetGatewayType | undefined;
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    gatewayInterval = -1
    intents: number[] = []
    sequenceNumber: number|null = null
    _heartbeatTime = -1
    ping = -1
    sessionID = ""
    cache: LRU = new LRU(1000)
    status: StatusType = { since: null, activities: null, status: "online", afk: false }
    reconnect = false
    lastReq = 0
    // deno-lint-ignore no-explicit-any
    intentHandlers: Map<string, (client: Client, data: any) => Promise<any>> = new Map()

    sleep = (t: number) => new Promise(reso => setTimeout(reso, t))

    constructor(token: string = "", ...intents: number[]) {
        super()
        this.token = token;
        this.intents = intents;

        for (const intent in IntentHandlers) {
            this.intentHandlers.set(intent, IntentHandlers[intent])
        }
    }
    /**
     * Adds intents to client
     * @return current client instance
     */
    addIntents(...intent: number[]): Client {
        this.intents.push(...intent);
        return this
    }

    // deno-lint-ignore no-explicit-any
    async _fetch<T>(method: string, path: string, body: string|FormData|null = "", json = true, contentType: string|boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType
        var req = new Request(`${constants.BASE_URL}/v${constants.VERSION}/${path}`, {
            method, body, headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": constants.USER_AGENT,
                ...headers,
            },
        })

        var response = await this._performReq(req)
        if (response.status == 400) throw Error((await response.json()).message)
        
        // deno-lint-ignore no-explicit-any
        let respJson: any
        if (json) {
            respJson = await response.json()
            if ((respJson as ErrorType).message) throw Error((respJson as ErrorType).message)
        }

        return json ? respJson : response;
    }

    async _performReq(req: Request): Promise<Response> {
        var resp: Response;
        if (this.lastReq == 0 || (Date.now() - this.lastReq > 250)) {
            this.lastReq = Date.now();
            resp = await fetch(req)
        } else {
            await this.sleep(Date.now() - (this.lastReq + 250))
            this.lastReq = Date.now();
            resp = await fetch(req);
        }

        if (resp.status == 429) {
            const { retry_after } = await resp.json();
            this.emit("debug", `Ratelimit, waiting ${retry_after}`);
            await this.sleep(retry_after);
            this.lastReq = Date.now();
            resp = await this._performReq(req)
        }

        return resp
    }

    _heartbeat() {
        if (this.socket.readyState != 1) return;
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 1, d: this.sequenceNumber }))
        this.emit("debug", "Sending heartbeat")
    }

    async _close() {
        if (this.socket.readyState == 1) return;
        clearInterval(this.gatewayInterval)
        this.emit("debug", "Connection closed trying to reconnect")
        this.reconnect = true
        this.login()
    }

    async _message(event: MessageEvent) {
        const response = JSON.parse(event.data)
        const { op, t, s, d } = response
        this.emit('raw', event.data)
        if (s) this.sequenceNumber = s
        if (op == 10) {
            this.gatewayInterval = setInterval(() => this._heartbeat.call(this), d.heartbeat_interval)

            const intents = this.intents.reduce((acc, cur) => acc |= cur, 0)

            this.socket.send(JSON.stringify({
                op: 2, d: {
                    token: "Bot " + this.token,
                    properties: {
                        $os: "linux", $browser: "corddis", $device: "corddis"
                    },
                    presence: {
                        status: "online", afk: false
                    }, intents
                }
            }))

            this.reconnect = false

            return
        }
        if (op == 11) {
            const calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
            return;
        }

        if (t == "READY") {
            this.sessionID = d.session_id
            this.user = new User(d.user, this)
            this.emit("READY", this.user)
            return
        }

        if (t) {
            const intentObject = await IntentHandler(this, response)
            if (intentObject) this.emit(t, ...intentObject);
        }
    }
    /**
     * Shortcut just to set client game
     * @return new presence
     */
    async game(name: string): Promise<StatusType> {
        return this.setStatus({
            since: null,
            status: this.status.status,
            activities: [{
                name, type: 0
            }],
            afk: false
        })
    }
    /**
     * Sets custom presence. Sends raw data to gateway.
     *      client.setStatus({
     *          since: null,
     *          status: "dnd",
     *          activities: [{
     *              name: "a game",
     *              type: 0
     *          }],
     *          afk: false
     *      })
     * @return new presence
     */
    async setStatus(d: StatusType): Promise<StatusType> {
        this.socket.send(JSON.stringify({
            op: 3, d
        }))
        this.status = d
        return d
    }
    /** Logins with a certain token */
    async login(token: string = this.token): Promise<boolean> {
        if (token.length == 0) throw Error("Invalid token");
        this.token = token.replace(/^(Bot|Bearer)\\s*/, "");
        this.gatewayData = await this._fetch<GetGatewayType>("GET", "gateway/bot", null, true)

        this.socket = new WebSocket(`${this.gatewayData.url}?v=${constants.VERSION}&encoding=json`)
        this.socket.addEventListener('open', (ev: Event) => (() => { this.emit("debug", "Connected to WebSocket") }).call(this))
        this.socket.addEventListener('message', (ev: MessageEvent) => this._message.call(this, ev))
        this.socket.addEventListener('close', (ev: CloseEvent) => this._close.call(this))

        return true;
    }
    /**
     * Fetches entities from Discord API
     *      client.get(EntityType.GUILD, "id") as Guild
     */
    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        if (this.cache.has(id)) return this.cache.get(id) as User | Guild;
        switch (entity) {
            // deno-lint-ignore no-case-declarations
            case EntityType.GUILD:
                const guild = await this._fetch<GuildType>("GET", `guilds/${id}`, null, true)
                this.cache.set(id, new Guild(guild, this))
                return this.cache.get(id) as Guild
            // deno-lint-ignore no-case-declarations
            case EntityType.USER:
                const user = await this._fetch<UserType>("GET", `users/${id}`, null, true)
                this.cache.set(id, new User(user, this))
                return this.cache.get(id) as User
            default:
                throw Error("Wrong EntityType")
        }
    }
    /** Gets current user as Me class */
    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        if (this.cache.has("me")) return this.cache.get("me") as Me
        const user = await this._fetch<UserType>("GET", `users/@me`, null, true)
        this.cache.set("me", new Me(user, this))
        return this.cache.get("me") as Me;
    }
    /** Fetches invite with a certain id */
    async fetchInvite(id: string): Promise<Invite> {
        if (this.cache.has(id)) return this.cache.get(id) as Invite
        const invite = await this._fetch<InviteType>("GET", `invites/${id}?with_counts=true`, null, true)
        let guild
        if (invite.guild) guild = await this.get(EntityType.GUILD, invite.guild.id) as Guild
        this.cache.set(id, new Invite(invite, this, guild))
        return this.cache.get(id) as Invite
    }
    /** Deletes a invite */
    async deleteInvite(id: string | Invite): Promise<InviteType> {
        if (id instanceof Invite) id = id.data.code
        if (this.cache.has(id)) this.cache.remove(id)
        return this._fetch<InviteType>("DELETE", `invites/${id}`, null, true)
    }

    toString() {
        return `Client {"ping":${this.ping},"sessionID":"${this.sessionID}","token":"${this.token}","user":{"data":${JSON.stringify(this.user?.data)}}}`
    }
}

export { Client };
