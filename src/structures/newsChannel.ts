import { Client, Snowflake } from "../../mod.ts";
import { ChannelType, ChannelTypeData, NewsFollowedChannelType } from "../types/channel.ts";
import { MessageType } from "../types/message.ts";
import { TextChannel } from "./textChannel.ts";
import { Guild } from "./guild.ts";
import { Message } from "./message.ts"

export class NewsChannel extends TextChannel {
    constructor(data: ChannelType, client: Client, guild?: Guild) {
        super(data, client, guild)
    }
    /** Crossposts a message */
    async crosspost(id: Snowflake): Promise<Message> {
        if (this.data.type != ChannelTypeData.GUILD_NEWS) throw Error("Message must be from a news channel")
        const message = await this.client._fetch<MessageType>("POST", `channels/${this.data.id}/messages/${id}/crosspost`, null, true)
        return new Message(message, this.client, this)
    }
    /** Follows a news channel to another text channel. */
    async follow(webhook_channel_id: string): Promise<NewsFollowedChannelType> {
        if (!webhook_channel_id) throw Error("Target webhook channel ID is not provided.")
        console.log(this.data)
        return await this.client._fetch<NewsFollowedChannelType>("POST", `channels/${this.data.id}/followers`, JSON.stringify({ webhook_channel_id }), true)
    }

    toString() {
        return `NewsChannel {"data":${JSON.stringify(this.data)}}`
    }
}