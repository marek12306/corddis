import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";
import { IntentObjects } from "./gatewayHelpers.ts"
import { Channel } from "./../structures/channel.ts";
import { UserType } from "./../types/user.ts"
import { GuildType } from "./../types/guild.ts"

class Client extends EventEmitter {
    public emit: any;
    token: String;
    user: User | null = null;
    gatewayData: any
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    gatewayInterval: any
    intents: number[] = []
    sequenceNumber: any = null
    _heartbeatTime: number = -1
    ping: number = -1
    sessionID: string = ""

    constants = constants;
    sleep = (t: number) => new Promise(reso => setTimeout(reso, t))

    constructor(token: String = "", ...intents: number[]) {
        super()
        this.token = token;
        this.intents = intents;
    }

    addIntents(...intent: number[]) {
        this.intents.push(...intent);
        return this
    }

    async _fetch<T>(method: string, path: string, body: any = "", json: boolean = true, contentType: any = "application/json", headers: any = {}): Promise<T> {
        let response = await fetch(
            `${this.constants.BASE_URL}/v${this.constants.VERSION}/${path}`,
            {
                method, body, headers: {
                    "Authorization": `Bot ${this.token}`,
                    "User-Agent": this.constants.USER_AGENT,
                    "Content-Type": contentType
                    ...headers,
                },
            },
        );
        if (response.status == 400) throw Error((await response.json()).message)

        if (response.status == 429) {
            let { retry_after } = await response.json();
            this.emit("debug", `Ratelimit, waiting ${retry_after}`);
            await this.sleep(retry_after);
            response = await this._fetch<Response>(method, path, body, false, contentType, headers)
            return json ? await response.json() : response;
        }

        var remaining = response.headers.get("x-ratelimit-remaining")
        if (parseFloat(remaining ?? "1")) {
            this.emit("debug", `Ratelimit, waiting ${remaining}`);
            await this.sleep(parseFloat(remaining ?? "0"))
        }

        return json ? await response.json() : response;
    }

    _heartbeat() {
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 1, d: this.sequenceNumber }))
        this.emit("debug", "Sending heartbeat")
    }

    async _open(event: any) {
        this.emit("debug", "Connected to WebSocket")
    }

    async _message(event: any) {
        let { op, response, t, s, d } = JSON.parse(event.data)
        this.emit('raw', response)
        if (s) this.sequenceNumber = response.s
        if (op == 10) {
            this.gatewayInterval = setInterval(() => this._heartbeat.call(this), d.heartbeat_interval)

            let intents = this.intents.reduce((acc, cur) => acc |= cur, 0)

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

            return
        }
        if (op == 11) {
            let calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
            return;
        }

        if (t == "READY") {
            this.sessionID = d.session_id
            this.user = new User(d.user, this)
            this.emit("READY", this.user)
            return
        }

        if (t && IntentObjects[t]) {
            let addProp = []
            if (t == "MESSAGE_CREATE") {
                let guild = await this.get(EntityType.GUILD, d.guild_id as string) as Guild;
                let channel = await guild.get(EntityType.CHANNEL, d.channel_id as string) as Channel;
                addProp.push(channel, guild)
            }
            this.emit(t, new IntentObjects[t](d, this, ...addProp));
        }
    }

    async login(token: String = this.token): Promise<boolean> {
        if (token.length == 0) throw Error("Invalid token");
        this.token = token.replace(/^(Bot|Bearer)\\s*/, "");
        this.gatewayData = await this._fetch<any>("GET", "gateway/bot", null, true)

        this.socket = new WebSocket(`${this.gatewayData.url}?v=${this.constants.VERSION}&encoding=json`)
        this.socket.addEventListener('open', (ev: Event) => this._open.call(this, ev))
        this.socket.addEventListener('message', (ev: Event) => this._message.call(this, ev))

        return true;
    }

    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        switch (entity) {
            case EntityType.GUILD:
                let guild = await this._fetch<GuildType>("GET", `guilds/${id}`, null, true)
                return new Guild(guild, this)
            case EntityType.USER:
                let user = await this._fetch<UserType>("GET", `users/${id}`, null, true)
                return new User(user, this);
            default:
                throw Error("Wrong EntityType")
        }
    }

    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        let user = await this._fetch<UserType>("GET", `users/@me`, null, true)
        return new Me(user, this);
    }
}

export { Client };
