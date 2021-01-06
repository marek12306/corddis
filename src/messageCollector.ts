import { Guild } from './structures/guild.ts'
import { Channel } from './structures/channel.ts'
import { Client } from './client/client.ts'
import { Message } from './structures/message.ts'

export interface CollectorOptions {
    max: Number
}

export default class MessageCollector {
    client: Client;
    guild: Guild;
    channel: Channel;
    filter: (msg: Message) => boolean;
    collected: Message[] = [];
    options: CollectorOptions;

    constructor(client: Client, guild: Guild, channel: Channel, filter: (msg: Message) => boolean, options: CollectorOptions) {
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.filter = filter;
        this.options = options;

        this.client.on("CHANNEL_DELETE", (channel: Channel) => this.handleDelete.call(this, channel))
        this.client.on("GUILD_REMOVE", (guild: Guild) => this.handleDelete.call(this, guild))
        this.client.on("MESSAGE_CREATE", (message: Message) => this.collectMessage.call(this, message))
        this.client.on("MESSAGE_DELETE", (message: Message) => this.deleteMessage.call(this, message))
        this.client.on("MESSAGE_DELETE_BULK", (messages: Message[]) => this.deleteMessage.call(this, message))
        this.client.emit("debug", `Registering a MessageCollector on ${this.channel.id} channel in guild ${this.guild.id}`)

    }

    private handleDelete(entity: Guild | Channel) {
        if(this.guild.id == entity.id || this.channel.id == entity.id) this.end()
    }

    private deleteMessage(...entities: Message[]) {
        for(const entity of entities) {
            if(this.guild.id != entity.guild?.id || this.channel.id != entity.channel.id) return
            const temp = this.collected.findIndex(it => it.id == entity.id);
            if(temp > -1) this.collected.splice(temp, 1)
        }
    }

    private collectMessage(msg: Message) {
        if(msg.channel.id == this.channel.id && msg.channel.id == this.guild.id && [msg].filter(this.filter).length) {
            this.collected.push(msg)
            if(this.collected.length >= this.options.max && this.options.max != -1) {
                this.end();
            }
        }
    }

    end() {
        this.client.removeListener("CHANNEL_DELETE", (channel: Channel) => this.handleDelete.call(this, channel))
        this.client.removeListener("GUILD_DELETE", (guild: Guild) => this.handleDelete.call(this, guild))
        this.client.removeListener("MESSAGE_CREATE", (message: Message) => this.collectMessage.call(this, message))
        this.client.removeListener("MESSAGE_DELETE", (message: Message) => this.deleteMessage.call(this, message))
        this.client.removeListener("MESSAGE_DELETE_BULK", (messages: Message[]) => this.deleteMessage.call(this, message))
        this.client.emit("debug", `Removing a MessageCollector on ${this.channel.id} channel in guild ${this.guild.id}`)
    }
}
