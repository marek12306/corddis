import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";
import { Message } from "./../structures/message.ts"
import { IntentObjects } from "./gatewayHelpers.ts"
import { MessageCreateParamsType } from "./../types/message.ts"
import { inflate } from "https://deno.land/x/denoflate/mod.ts";

class Client extends EventEmitter {
    token: String;
    user: User | null = null;
    gatewayData: any
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    gatewayInterval: any
    intents: number[] = []
    sequenceNumber: any = null
    _heartbeatTime: number = -1
    ping: number = -1

    constants = constants;

    constructor(token: String = "", ...intents: number[]) {
        super()
        this.token = token;
        this.intents = intents;
    }

    addIntents(...intent: number[]) {
        this.intents.push(...intent);
        return this
    }

    _path(suffix: string) {
        return `${this.constants.BASE_URL}/v${this.constants.VERSION}/${suffix}`;
    }

    _options(method: string, body: string = "") {
        return {
            method,
            body,
            headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": this.constants.USER_AGENT,
                "Content-Type": "application/json"
            },
        };
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
        let data = event.data
        console.log(data)
        if (data.endsWith(this.constants.ZLIB_SUFFIX)) {
            let textEncoder = new TextEncoder();
            let textDecoder = new TextDecoder("utf-8");
            data = textDecoder.decode(inflate(textEncoder.encode(data.toString())))
        } 
        data = JSON.parse(event.data.toString())
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
        } else if (data.t && IntentObjects[data.t]) {
            let object = new IntentObjects[data.t](data.d, this)
            this.emit(data.t, object);
        }
    }

    async login(token: String = this.token): Promise<User> {
        if (token.length == 0) throw Error("Invalid token");
        this.token = token.replace(/^(Bot|Bearer)\\s*/, "");
        let response = await fetch(
            this._path(`/users/@me`),
            this._options("GET")
        );
        this.user = new User(await response.json(), this);

        response = await fetch(
            this._path(`/gateway/bot`),
            this._options("GET")
        )
        this.gatewayData = await response.json()

        this.socket = new WebSocket(`${this.gatewayData.url}?v=${this.constants.VERSION}&encoding=json&compress=true`)
        this.socket.addEventListener('open', (ev: Event) => this._open.call(this, ev))
        this.socket.addEventListener('message', (ev: Event) => this._message.call(this, ev))

        return this.user;
    }

    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        var response;
        switch (entity) {
            case EntityType.GUILD:
                response = await fetch(
                    this._path(`/guilds/${id}`),
                    this._options("GET"));
                let guild = await response.json();
                return new Guild(guild, this)
            case EntityType.USER:
                response = await fetch(
                    this._path(`/users/${id}`),
                    this._options("GET"));
                let user = await response.json();
                return new User(user, this);
            default:
                throw Error("Wrong EntityType")
        }
    }

    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        let response = await fetch(
            this._path(`/users/@me`),
            this._options("GET"),
        );
        let user = await response.json();
        return new Me(user, this);
    }
}

export { Client };
