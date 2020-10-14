import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";
import EventEmitter from "https://deno.land/x/events/mod.ts";

class Client extends EventEmitter {
    token: String;
    user: User | null = null;
    gatewayData: any
    socket: any
    gatewayInterval: any

    constants = constants;

    constructor(token: String = "") {
        super()
        this.token = token;
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
        this.socket.send(JSON.stringify({ op: 1 }))
    }

    async _open(event: any) {
    }

    async _message(event: any) {
        let data = JSON.parse(event.data.toString())
        switch (data.op) {
            case  10:
                this.gatewayInterval = setInterval(
                    this._heartbeat,
                    data.d.heartbeat_interval
                )

                this.socket.send(JSON.stringify({
                    token: `Bot ${this.token}`,
                    properties: {
                        $os: "linux",
                        $browser: "corddis",
                        $device: "corddis"
                    },
                    presence: {
                        status: "dnd",
                        afk: false
                    },
                    intents: 1 << 9
                }))
            default:
                this.emit('raw', data)
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

        this.socket = new WebSocket(`${this.gatewayData.url}?v=${this.constants.VERSION}&encoding=json`)
        this.socket.addEventListener('open', this._open)
        this.socket.addEventListener('message', this._message)

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
