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
            let ratelimit = await response.json();
            console.log(`Ratelimit, waiting ${ratelimit.retry_after}s...`);
            await this.sleep(ratelimit.retry_after);
            response = await this._fetch<Response>(method, path, body, false, contentType, headers)
        } else if (parseInt(response.headers.get("x-ratelimit-remaining") ?? "1") == 0) {
            console.log(`Sleeping ${response.headers.get("x-ratelimit-reset-after")}s`)
            await this.sleep(parseFloat(response.headers.get("x-ratelimit-reset-after") ?? "0"))
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
        let data = JSON.parse(event.data)
        this.emit('raw', data)
        if (data.s) this.sequenceNumber = data.s
        if (data.op == 10) {
            this.gatewayInterval = setInterval(
                () => this._heartbeat.call(this),
                data.d.heartbeat_interval
            )

            let intents = this.intents.reduce((acc, cur) => acc |= cur, 0)

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
        } else if (data.op == 11) {
            let calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
        } else if (data.t == "READY") {
            this.sessionID = data.d.session_id
            this.user = new User(data.d.user, this)
            this.emit("READY", this.user)
        } else if (data.t && IntentObjects[data.t]) {
            let addProp = []
            if (data.t == "MESSAGE_CREATE") {
                let guild = await this.get(EntityType.GUILD, data.d.guild_id as string) as Guild;
                let channel = await guild.get(EntityType.CHANNEL, data.d.channel_id as string) as Channel;
                addProp.push(channel, guild)
            }
            let object = new IntentObjects[data.t](data.d, this, ...addProp)
            this.emit(data.t, object);
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
        var response;
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

    async blobToUINT8(blob: Blob): Promise<Uint8Array> {
        return new Promise(function (resolve) {
            var reader = new FileReader();
            reader.onloadend = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
            reader.readAsArrayBuffer(blob);
        });
    }
}

export { Client };
