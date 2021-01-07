import { Guild } from './structures/guild.ts'
import { Channel } from './structures/channel.ts'
import { Client } from './client/client.ts'
import { Message } from './structures/message.ts'
import { EventEmitter } from "../deps.ts"

export interface CollectorOptions {
    max: Number
}

export class MessageCollector extends EventEmitter {
    client: Client;
    guild: Guild | undefined;
    channel: Channel;
    filter: (msg: Message) => boolean;
    collected: Message[] = [];
    options: CollectorOptions;
    id: number;

    constructor(client: Client, guild: Guild | undefined, channel: Channel, filter: (msg: Message) => boolean, options: CollectorOptions) {
        super()
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.filter = filter;
        this.options = options;

        this.client.setMaxListeners(this.client.getMaxListeners() + 1)

        this.client.on("CHANNEL_DELETE", (channel: Channel) => this.handleDelete.call(this, channel))
        if (this.guild) this.client.on("GUILD_REMOVE", (guild: Guild) => this.handleDelete.call(this, guild))
        this.client.on("MESSAGE_CREATE", (message: Message) => this.collectMessage.call(this, message))
        this.client.on("MESSAGE_DELETE", (message: Message) => this.deleteMessage.call(this, message))
        this.client.on("MESSAGE_DELETE_BULK", (messages: Message[]) => this.deleteMessage.call(this, ...messages))
        this.client.emit("debug", `Registering a MessageCollector on ${this.channel.id} ${this.guild ? "" : "dm"} channel ${this.guild ? `in guild ${this.guild?.id}}` : ""}`)
        this.client.emit("COLLECTOR_REGISTER", (this.id = ++this.client.collectors))
        this.emit("start")
    }

    private handleDelete(entity: Guild | Channel) {
        if((this.guild?.id == entity.id && this.guild) || this.channel.id == entity.id) this.end()
    }

    private deleteMessage(...entities: Message[]) {
        for(const entity of entities) {
            if((this.guild?.id != entity.guild?.id && this.guild) || this.channel.id != entity.channel.id) return
            const temp = this.collected.findIndex(it => it.id == entity.id);
            if(temp > -1) this.collected.splice(temp, 1)
        }
    }

    private collectMessage(msg: Message) {
        if(msg.channel.id == this.channel.id && msg.guild?.id == this.guild?.id && [msg].filter(this.filter).length) {
            console.log(`${this.collected.length}, ${this.options.max}`)
            if(this.collected.length >= this.options.max && this.options.max != -1) {
                this.end();
            }
        }
    }

    end() {
        this.client.removeListener("CHANNEL_DELETE", (channel: Channel) => this.handleDelete.call(this, channel))
        if (this.guild) this.client.removeListener("GUILD_DELETE", (guild: Guild) => this.handleDelete.call(this, guild))
        this.client.removeListener("MESSAGE_CREATE", (message: Message) => this.collectMessage.call(this, message))
        this.client.removeListener("MESSAGE_DELETE", (message: Message) => this.deleteMessage.call(this, message))
        this.client.removeListener("MESSAGE_DELETE_BULK", (messages: Message[]) => this.deleteMessage.call(this, ...messages))

        this.client.setMaxListeners(this.client.getMaxListeners() - 1)

        this.client.emit("debug", `Removing a MessageCollector on ${this.channel.id} ${this.guild ? "" : "dm"} channel ${this.guild ? `in guild ${this.guild?.id}}` : ""}`)
        this.client.emit("COLLECTOR_END", this.id)
        this.emit("end", this.collected)
    }
}
