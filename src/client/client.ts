import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";
import { LRU } from "https://deno.land/x/lru/mod.ts";
import { IntentObjects } from "./gatewayHelpers.ts"
import { Channel } from "./../structures/channel.ts";
import { UserType, ActivityType, StatusType } from "./../types/user.ts"
import { GuildType } from "./../types/guild.ts"

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
        if (contentType) headers["Content-Type"] = contentType;
        let response = await fetch(
        `${this.constants.BASE_URL}/v${this.constants.VERSION}/${path}`,
        {
            method,
            body,
            headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": this.constants.USER_AGENT,
                ...headers,
            },
        },
        );
        if (response.status == 429) {
            const ratelimit = await response.json();
            console.log(`Ratelimit, waiting ${ratelimit.retry_after}s...`);
            await this.sleep(ratelimit.retry_after);
            response = await this._fetch<Response>(method, path, body, false, contentType, headers)
        } else if (parseInt(response.headers.get("x-ratelimit-remaining") ?? "1") == 0) {
            console.log(`Sleeping ${response.headers.get("x-ratelimit-reset-after")}s`)
            await this.sleep(parseFloat(response.headers.get("x-ratelimit-reset-after") ?? "0"))
        }
        if (response.status == 400) {
            throw Error((await response.json()).message)
        }
        return json ? await response.json() : response;
    }

    _heartbeat() {
        if (this.socket.readyState != 1 || this.reconnect) return;
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 1, d: this.sequenceNumber }))
        this.emit("debug", "Sending heartbeat")
    }

    async _open(event: any) {
        this.emit("debug", "Connected to WebSocket")
    }

    async _close() {
        if (this.socket.readyState == 1) return;
        this.emit("debug", "Connection closed trying to reconnect")
        this.reconnect = true
        this.login()
    }

    async _message(event: any) {
        const data = JSON.parse(event.data)
        this.emit('raw', data)
        if (data.s) this.sequenceNumber = data.s
        if (data.op == 10) {
            if (this.gatewayInterval) clearInterval(this.gatewayInterval)
            this.gatewayInterval = setInterval(
                () => this._heartbeat.call(this),
                data.d.heartbeat_interval
            )

            const intents = this.intents.reduce((acc, cur) => acc |= cur, 0)

            if (this.reconnect) {
                this.socket.send(JSON.stringify({
                    op: 6, d: {
                        token: this.token,
                        session_id: this.sessionID,
                        seq: this.sequenceNumber
                    }
                }))
                this.reconnect = false
            } else {
                this.socket.send(JSON.stringify({
                    op: 2, d: {
                        token: "Bot " + this.token,
                        properties: {
                            $os: "linux",
                            $browser: "corddis",
                            $device: "corddis"
                        },
                        presence: {
                            status: "online",
                            afk: false
                        }, intents
                    }
                }))
            }
        } else if (data.op == 11) {
            const calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
        } else if (data.op == 9) {
            this.emit("debug", "Session invalidated, reconnecting...")
            this.login()
        } else if (data.t == "READY") {
            this.sessionID = data.d.session_id
            this.user = new User(data.d.user, this)
            this.emit("READY", this.user)
        } else if (data.t && IntentObjects[data.t]) {
            const addProp = []
            if (data.t == "MESSAGE_CREATE") {
                const guild = await this.get(EntityType.GUILD, data.d.guild_id as string) as Guild;
                const channel = await guild.get(EntityType.CHANNEL, data.d.channel_id as string) as Channel;
                addProp.push(channel, guild)
            }
            const object = new IntentObjects[data.t](data.d, this, ...addProp)
            this.emit(data.t, object);
        }
    }

    async setStatus(d: StatusType) {
        console.log(JSON.stringify({op:3,d}))
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
        if (this.cache.has(id)) return this.cache.get(id) as User|Guild;
        var response;
        switch (entity) {
            // deno-lint-ignore no-case-declarations
            case EntityType.GUILD:
                const guild = await this._fetch<GuildType>("GET", `guilds/${id}`, null, true)
                this.cache.set(id, new Guild(guild, this))
                return this.cache.get(id) as User|Guild
            // deno-lint-ignore no-case-declarations
            case EntityType.USER:
                const user = await this._fetch<UserType>("GET", `users/${id}`, null, true)
                this.cache.set(id, new User(user, this))
                return this.cache.get(id) as User|Guild;
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
}

export { Client };
