import { Client } from "./../client/client.ts";
import { MessageType } from "../types/message.ts";
import { EntityType } from "../types/utils.ts";
import { Guild } from "./guild.ts";
import { Channel } from "./channel.ts";

export class Message {
    data: MessageType;
    client: Client;

    constructor(data: MessageType, client: Client) {
        this.data = data;
        this.client = client;
    }

    async reply(content: string): Promise<Message> {
        let guild = await this.client.get(EntityType.GUILD, this.data.guild_id as string) as Guild;
        let channel = await guild.get(EntityType.CHANNEL, this.data.channel_id as string) as Channel;
        return channel.sendMessage({ content })
    }

    async delete(): Promise<boolean> {
        let guild = await this.client.get(EntityType.GUILD, this.data.guild_id as string) as Guild;
        let channel = await guild.get(EntityType.CHANNEL, this.data.channel_id as string) as Channel;
        return channel.deleteMessage(this.data.id)
    }
}