import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";
import { LRU } from "https://deno.land/x/lru/mod.ts";
import { UserType, ActivityType, StatusType } from "./../types/user.ts"
import { GuildType } from "./../types/guild.ts"
import { IntentHandler } from "./intentHandler.ts";

class Client extends EventEmitter {
    public emit: any;
    token: string;
    user: User | null = null;
    gatewayData: any
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    gatewayInterval: any
    intents: number[] = []
    sequenceNumber: any = null
    _heartbeatTime: number = -1
    ping: number = -1
    sessionID: string = ""
    cache: LRU = new LRU(1000)
    status: StatusType = { since: null, activities: null, status: "online", afk: false }
    reconnect = false
    lastReq = 0

    constants = constants;
    sleep = (t: number) => new Promise(reso => setTimeout(reso, t))

    constructor(token: string = "", ...intents: number[]) {
        super()
        this.token = token;
        this.intents = intents;
    }

    addIntents(...intent: number[]) {
        this.intents.push(...intent);
        return this
    }

    async _fetch<T>(method: string, path: string, body: any = "", json: boolean = true, contentType: any = "application/json", headers: any = {}): Promise<T> {
        var req = new Request(`${this.constants.BASE_URL}/v${this.constants.VERSION}/${path}`, {
            method, body, headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": this.constants.USER_AGENT,
                "Content-Type": contentType,
                ...headers,
            },
        })

        var response = await this.performReq(req)
        if (response.status == 400) throw Error((await response.json()).message)

        return json ? await response.json() : response;
    }

    async performReq(req: Request): Promise<Response> {
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
            resp = await this.performReq(req)
        }

        return resp
    }

    _heartbeat() {
        if (this.socket.readyState != 1) return;
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 1, d: this.sequenceNumber }))
        this.emit("debug", "Sending heartbeat")
    }

    async _open(event: any) {
        this.emit("debug", "Connected to WebSocket")
    }

    async _close() {
        if (this.socket.readyState == 1) return;
        clearInterval(this.gatewayInterval)
        this.emit("debug", "Connection closed trying to reconnect")
        this.reconnect = true
        this.login()
    }

    async _message(event: any) {
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

    async game(name: string) {
        return this.setStatus({
            since: null,
            status: this.status.status,
            activities: [{
                name, type: 0
            }],
            afk: false
        })
    }

    async setStatus(d: StatusType) {
        this.socket.send(JSON.stringify({
            op: 3, d
        }))
        this.status = d
        return d
    }

    async login(token: string = this.token): Promise<boolean> {
        if (token.length == 0) throw Error("Invalid token");
        this.token = token.replace(/^(Bot|Bearer)\\s*/, "");
        this.gatewayData = await this._fetch<any>("GET", "gateway/bot", null, true)

        this.socket = new WebSocket(`${this.gatewayData.url}?v=${this.constants.VERSION}&encoding=json`)
        this.socket.addEventListener('open', (ev: Event) => this._open.call(this, ev))
        this.socket.addEventListener('message', (ev: Event) => this._message.call(this, ev))
        this.socket.addEventListener('close', (ev: Event) => this._close.call(this))

        return true;
    }

    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        if (this.cache.has(id)) return this.cache.get(id) as User | Guild;
        switch (entity) {
            // deno-lint-ignore no-case-declarations
            case EntityType.GUILD:
                const guild = await this._fetch<GuildType>("GET", `guilds/${id}`, null, true)
                this.cache.set(id, new Guild(guild, this))
                return this.cache.get(id) as User | Guild
            // deno-lint-ignore no-case-declarations
            case EntityType.USER:
                const user = await this._fetch<UserType>("GET", `users/${id}`, null, true)
                this.cache.set(id, new User(user, this))
                return this.cache.get(id) as User | Guild
            default:
                throw Error("Wrong EntityType")
        }
    }

    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        if (this.cache.has("me")) return this.cache.get("me") as Me
        const user = await this._fetch<UserType>("GET", `users/@me`, null, true)
        this.cache.set("me", new Me(user, this))
        return this.cache.get("me") as Me;
    }

    toString() {
        return `Client {"ping":${this.ping},"sessionID":"${this.sessionID}","token":"${this.token}","user":{"data":${JSON.stringify(this.user?.data)}}}` 
    }
}

export { Client };
