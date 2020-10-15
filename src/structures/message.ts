import { Client } from "./../client/client.ts";
import { MessageType } from "../types/message.ts";
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
}