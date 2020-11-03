import { Client } from "./../client/client.ts";
import { MessageType, MessageEditParamsType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { TextChannel } from "./textChannel.ts";
import { NewsChannel } from "./newsChannel.ts"
import { ChannelTypeData } from "../types/channel.ts";

export class Message {
    data: MessageType;
    client: Client;
    channel: NewsChannel|TextChannel;
    guild?: Guild;

    constructor(data: MessageType, client: Client, channel: NewsChannel|TextChannel, guild?: Guild) {
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
    /**
     * Crossposts a message.
     * @return this message
     */
    async crosspost(): Promise<Message> {
        if (this.channel.data.type != ChannelTypeData.GUILD_NEWS) throw Error("Message channel is not a news channel")
        const message = await this.channel.crosspost(this.data.id)
        if (!message) return this
        this.data = message.data
        return this
    }

    toString() {
        return `Message {"data":${JSON.stringify(this.data)},"channel":{"data":${JSON.stringify(this.channel.data)}},"guild":${this.guild ? `{"data":${JSON.stringify(this.guild.data)}}` : "undefined"}}`
    }
}