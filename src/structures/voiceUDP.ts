import { Client } from "../../mod.ts";
import { VoiceLocalType, VoiceReadyType } from "../types/voice.ts";
import { Voice } from "./voice.ts";

export class VoiceUDP {
    client: Client;
    voice: Voice;
    data: VoiceReadyType|undefined
    connection: Deno.DatagramConn|undefined
    local: VoiceLocalType|undefined;
    key: Uint32Array|undefined

    constructor(client: Client, voice: Voice) {
        this.client = client
        this.voice = voice
    }

    _parseDiscovery(packet: Uint8Array) {
        let address = ""
        for (let i = 4; i < packet.indexOf(0, i); i++)
            address += String.fromCharCode(packet[i])
        const port = parseInt(new DataView(packet.buffer, packet.byteOffset, packet.byteLength).getUint16(packet.length - 2, true).toString(10), 10)
        return { address, port }
    }

    async _handleDiscovery() {
        if (!this.connection || !this.data) throw Error("Connection data not found")
        const packet = new Uint8Array(70)
        new DataView(packet.buffer, packet.byteOffset, packet.byteLength)
            .setUint16(0, 625834)
        this.client.emit("debug", "Sending discovery packet.")
        this.sendRaw(packet)
        const received = (await this.connection.receive())[0]
        this.local = this._parseDiscovery(received)
        this.client.emit("debug", "Discovery was successful, sending select protocol payload.")
        this.voice.socket.send(JSON.stringify({
            op: 1, d: {
                protocol: "udp",
                data: {
                    address: this.local.address,
                    port: this.local.port,
                    mode: "xsalsa20_poly1305"
                }
            }
        }))
        console.log("ok boomer")
        for (const x of await this.connection.receive()) {
            console.log('chuj')
            console.log(x)
        }
    }

    async sendRaw(packet: Uint8Array) {
        if (!this.data) throw Error("Connection data not found")
        console.log({ transport: "udp", hostname: this.data.ip, port: this.data.port })
        this.connection?.send(packet, { transport: "udp", hostname: this.data.ip, port: this.data.port })
    }

    async sendVoice(buf: Uint8Array, sequence: number, time: number) {
        if (!this.data) throw Error("Connection data not found")
        if (!this.connection) throw Error("Voice not connected")
        const packet = new Uint8Array(12 + buf.length)
        packet[0] = 0x80 // version + flags
        packet[1] = 0x78 // payload type
        const dataview = new DataView(packet.buffer, packet.byteOffset, packet.byteLength)
        dataview.setUint16(2, sequence)
        dataview.setUint16(4, time)
        dataview.setUint16(8, this.data.ssrc)
        packet.set(buf, 12)
        this.client.emit("debug", "Sending voice packet.")
        this.sendRaw(packet)
    }

    async connect() {
        if (!this.data?.port || !this.data?.ip) throw Error("Connection data is not complete.")
        if (this.connection) try { 
            this.connection.close() 
        } catch {
            this.client.emit("debug", "Failed to close connection (probably already closed), ignoring...")
        }
        this.connection = Deno.listenDatagram({
            hostname: "0.0.0.0",
            port: this.data.port,
            transport: "udp"
        })
        this.client.emit("debug", `Listening on UDP port ${this.data.port}...`)
        this._handleDiscovery()
    }
}