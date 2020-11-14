import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";
import { Client } from "../../mod.ts";
import { VoiceIdentifyType } from "../types/voice.ts";
import { Guild } from "./guild.ts";
import { VoiceUDP } from "./voiceUDP.ts";

export class Voice extends EventEmitter {
    client: Client;
    guild: Guild;
    socket: WebSocket = new WebSocket("ws://echo.websocket.org/");
    _heartbeatTime = -1
    sequenceNumber: number|null = null
    interval = -1
    data: VoiceIdentifyType = {}
    ping = -1
    udp: VoiceUDP
    connected = false

    constructor(client: Client, guild: Guild) {
        super()
        this.client = client
        this.guild = guild
        this.udp = new VoiceUDP(this.client, this)
    }

    _heartbeat() {
        if (this.socket.readyState != 1) return;
        this._heartbeatTime = Date.now()
        this.socket.send(JSON.stringify({ op: 3, d: Date.now() }))
        this.client.emit("debug", `Sending voice heartbeat`)
    }

    async _close() {
        if (this.socket.readyState == 1) return;
        this._heartbeatTime = Date.now()
        clearInterval(this.interval)
        if (!this.connected) {
            // this.udp.connection?.close()
            return this.client.emit("debug", "Voice gateway connection ended")
        }
        this.client.emit("debug", `Voice gateway connection closed, trying to reconnect`)
        this.connect()
    }

    async _message(event: MessageEvent) {
        const response = JSON.parse(event.data)
        const { op, t, s, d } = response
        this.emit('raw', event.data)

        if (op == 8) {
            this.interval = setInterval(() => this._heartbeat.call(this), d.heartbeat_interval)

            this.socket.send(JSON.stringify({
                op: 0, d: {
                    ...this.data
                }
            }))
        }

        if (op == 6) {
            const calculated = Date.now() - this._heartbeatTime
            this.ping = calculated > 1 ? calculated : this.ping
            return
        }

        if (op == 2) {
            this.udp.data = d
            return this.udp.connect()
        }

        if (op == 4) {
            this.udp.key = Uint32Array.from(d.secret_key)
            this.client.emit("debug", "Protocol selected successfuly.")
            this.client.emit(`voice${this.guild.data.id}`, true)
            return
        }
    }
    /** Sets speaking state */
    speaking(speaking: boolean) {
        this.socket.send(JSON.stringify({
            op: 5, d: {
                speaking: +speaking,
                delay: 0,
                ssrc: this.udp.data?.ssrc
            }
        }))
    }
    /** Reconnects client to the gateway. */
    reconnect() {
        this.socket.close()
    }
    /** Logins with a certain token */
    async connect(): Promise<boolean> {
        this.client.emit(`${this.guild.data.id}voice`, false)
        throw Error("Voice is not supported for now")
        // if (!this.data.endpoint || !this.data.session_id) throw Error("Required data to connect are incomplete.")

        // clearInterval(this.interval)

        // this.socket = new WebSocket(`wss://${this.data.endpoint}/?v=4`)
        // this.socket.addEventListener('open', (ev: Event) => (() => { 
        //     this.client.emit("debug", `Connected to Voice WebSocket`) 
        //     this.connected = true
        // }).call(this))
        // this.socket.addEventListener('message', (ev: MessageEvent) => this._message.call(this, ev))
        // this.socket.addEventListener('close', (ev: CloseEvent) => this._close.call(this))

        // return true;
    }

    async disconnect(): Promise<boolean> {
        this.connected = false
        this.socket.close()
        return true
    }
}