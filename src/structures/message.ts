import { Client } from "./../client/client.ts";
import { MessageType, MessageEditParamsType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { Channel } from "./channel.ts";

export class Message {
    data: MessageType;
    client: Client;
    channel: Channel;
    guild?: Guild;
    /** Creates a Message instance. */
    constructor(data: MessageType, client: Client, channel: Channel, guild?: Guild) {
        this.data = data;
        this.client = client;
        this.channel = channel;
        this.guild = guild;
    }
    /** Replies to a message with some text content. */
    async reply(content: string): Promise<Message> {
        return this.channel.sendMessage({ content })
    }
    /** Deletes message. */
    async delete(): Promise<boolean> {
        return this.channel.deleteMessage(this.data.id)
    }
    /** Edits a message. */
    async edit(data: (MessageEditParamsType | string)): Promise<Message> {
        return this.channel.editMessage(this.data.id, data)
    }
    /** Reacts to a message with emoji */
    async react(emoji: string): Promise<boolean> {
        return this.channel.react(this.data.id, emoji)
    }
    /** Deletes previously added reaction from a message. */
    async unreact(emoji: string): Promise<boolean> {
        return this.channel.unreact(this.data.id, emoji)
    }

    toString() {
        return `Message {"data":${JSON.stringify(this.data)},"channel":{"data":${JSON.stringify(this.channel.data)}},"guild":${this.guild ? `{"data":${JSON.stringify(this.guild.data)}}` : "undefined"}}`
    }
}