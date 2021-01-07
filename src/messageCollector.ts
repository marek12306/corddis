import { Guild } from './structures/guild.ts'
import { Channel } from './structures/channel.ts'
import { Client } from './client/client.ts'
import { Message } from './structures/message.ts'
import { EventEmitter } from '../deps.ts'

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
    id: number = 0;

    constructor(client: Client, guild: Guild | undefined, channel: Channel, filter: (msg: Message) => boolean, options: CollectorOptions) {
        super()
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.filter = filter;
        this.options = options;

        this.on("_collect_", this.collectMessage)
        this.client.emit("debug", `Registering a MessageCollector on ${this.channel.id}, collector id ${this.id}`)
    }

    private handleDelete(entity: Guild | Channel) {
        if((this.guild?.id == entity.id && this.guild) || this.channel.id == entity.id) this.end()
    }

    private deleteMessage(...entities: Message[]) {
        for(const entity of entities) {
            if((this.guild?.id != entity.guild?.id && this.guild) || this.channel.id != entity.channel.id) return
            const temp = this.collected.findIndex(it => it.id == entity.id);
            if(temp > -1) this.collected.splice(temp, 1);
        }
    }

    private collectMessage(msg: Message) {
        if(msg.channel.id == this.channel.id && msg.guild?.id == this.guild?.id && this.filter(msg)) {
            this.collected.push(msg);
            this.emit("collect", msg);
            if(this.options.max !== -1 && this.collected.length >= this.options.max) this.end();
        }
    }

    end() {
        this.client.emit("debug", `Removing a MessageCollector on ${this.channel.id} channel, collector id ${this.id}`)
        this.client.emit("COLLECTOR_END", this.id)
        this.client.removeCollector(this.id, true)
        this.emit("end", this.collected)
    }
}
