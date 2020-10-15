import { Client } from "./../client/client.ts";
import { MessageType, MessageEditParamsType } from "../types/message.ts";
import { EntityType } from "../types/utils.ts";
import { Guild } from "./guild.ts";
import { Channel } from "./channel.ts";

export class Message {
    data: MessageType;
    client: Client;
    channel: Channel;
    guild?: Guild;

    constructor(data: MessageType, client: Client, channel: Channel, guild?: Guild) {
        this.data = data;
        this.client = client;
        this.channel = channel;
        this.guild = guild;
    }

    async reply(content: string): Promise<Message> {
        return this.channel.sendMessage({ content })
    }

    async delete(): Promise<boolean> {
        return this.channel.deleteMessage(this.data.id)
    }

    async edit(data: (MessageEditParamsType | string)): Promise<Message> {
        return this.channel.editMessage(this.data.id, data)
    }

    async react(emoji: string): Promise<boolean> {
        return this.channel.react(this.data.id, emoji)
    }
    
    async unreact(emoji: string): Promise<boolean> {
        return this.channel.unreact(this.data.id, emoji)
    }
}