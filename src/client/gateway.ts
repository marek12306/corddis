import { Client, User } from "../../mod.ts";
import { Constants } from "../constants.ts";
import { UnavailableGuildType } from "../types/guild.ts";
import { StatusType } from "../types/user.ts";
import { Snowflake } from "../types/utils.ts";
import { VoiceStateUpdateType } from "../types/voice.ts";
import intents from '../intents/mod.ts';

export class Gateway {
    ping = -1;
    interval = -1
    _heartbeatTime = -1
    sequenceNumber: number | null = null
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    sessionID: string | null = ""
    ready = false
    client: Client
    status: StatusType = { since: null, activities: null, status: "online", afk: false }
    shard: number[]
    user: User | undefined
    guilds: UnavailableGuildType[] = []

    constructor(client: Client, shard: number[]) {
        this.client = client
        this.shard = shard
    }

    _heartbeat() {
        if (this.socket.readyState != 1) return;
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 1, d: this.sequenceNumber }))
        this.client.events.post(["DEBUG", `Sending shard ${this.shard[0]} heartbeat`])
    }

    async _close() {
        if (this.socket.readyState == 1) return;
        clearInterval(this.interval)
        this.client.events.post(["DEBUG", `Connection closed on shard ${this.shard[0]}, trying to reconnect`])
        this.login()
    }

    async _message(event: MessageEvent) {
        const response = JSON.parse(event.data)
        const { op, t, s, d } = response
        this.client.events.post(['RAW', { data: event.data, gateway: this }])
        if (s) this.sequenceNumber = s
        if (op == 9) {
            this.client.events.post(["DEBUG", `Invalid session on shard ${this.shard[0]}, trying to reconnect after 5 seconds...`])
            return setTimeout(() => this.reconnect(true), 5000)
        }
        if (op == 10) {
            this.interval = setInterval(() => this._heartbeat.call(this), d.heartbeat_interval)

            const intents = this.client.intents.reduce((acc, cur) => acc |= cur, 0)

            if (this.sessionID) {
                this.socket.send(JSON.stringify({
                    op: 6, d: {
                        token: "Bot " + this.client.token,
                        session_id: this.sessionID,
                        seq: this.sequenceNumber
                    }
                }))
            } else {
                this.socket.send(JSON.stringify({
                    op: 2, d: {
                        token: "Bot " + this.client.token,
                        properties: {
                            $os: Deno.build.os, $browser: this.client.mobile ? "Discord iOS" : "corddis", $device: "corddis"
                        },
                        presence: {
                            status: "online", afk: false
                        },
                        intents,
                        shard: this.shard
                    }
                }))
            }

            return
        }
        if (op == 11) {
            const calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
            return;
        }

        if (t == "READY") {
            this.sessionID = d.session_id
            this.user = new User(d.user, this.client)
            this.client.user = this.user
            this.guilds = d.guilds
            this.ready = true
            this._heartbeat()
            this.client.events.post(["READY", this.user])
            return
        }

        if (t == "RESUMED") return this.client.events.post(["DEBUG", `Connection on shard ${this.shard[0]} resumed successfuly`])

        if (t == "RECONNECT") return this.reconnect()

        if (t) {
            const intentObject = await intents[t]?.(this, this.client, response)
            if (intentObject) this.client.events.post([t, intentObject])
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
    /** Request members of a guild by gateway. */
    async requestGuildMembers(guild_id: Snowflake, limit = 0, query = "") {
        this.socket.send(JSON.stringify({
            op: 8, d: {
                guild_id, query, limit, presences: true
            }
        }))
    }
    /** Sends voice state update request. */
    async voiceStateUpdate(d: VoiceStateUpdateType) {
        this.socket.send(JSON.stringify({
            op: 4, d
        }))
    }
    /** Reconnects client to the gateway. */
    reconnect(hard = false) {
        if (hard) this.sessionID = this.sequenceNumber = null
        this.socket.close()
    }
    /** Logins with a certain token */
    async login(token: string = this.client.token): Promise<boolean> {
        if (!this.client.gatewayData) throw Error("Gateway data not found.")

        this.socket = new WebSocket(`${this.client.gatewayData.url}?v=${Constants.VERSION}&encoding=json`)
        this.socket.addEventListener('open', (ev: Event) => (() => { this.client.events.post(["DEBUG", `Shard ${this.shard[0]} connected to WebSocket`]) }).call(this))
        this.socket.addEventListener('message', (ev: MessageEvent) => this._message.call(this, ev))
        this.socket.addEventListener('close', (ev: CloseEvent) => this._close.call(this))

        return true;
    }

    toString() {
        return `Gateway {"ping":${this.ping},"sessionID":"${this.sessionID}"}`
    }
}