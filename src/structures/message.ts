import { Client } from "./../client/client.ts";
import { MessageType, MessageEditParamsType, MessageCreateParamsType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { TextChannel } from "./textChannel.ts";
import { NewsChannel } from "./newsChannel.ts"
import { ChannelTypeData } from "../types/channel.ts";
import { EmbedType } from "../types/embed.ts";
import { EmbedBuilder } from "../embed.ts";
import { Snowflake } from "../types/utils.ts";

export class Message {
    #client: Client
    data: MessageType
    channel: NewsChannel | TextChannel
    guild?: Guild

    constructor(data: MessageType, client: Client, channel: NewsChannel | TextChannel, guild?: Guild) {
        this.#client = client
        this.data = data;
        this.channel = channel;
        this.guild = guild;
    }

    /** Replies to a message with some text content or an embed. */
    async reply(content: string, reply?: boolean, mention?: boolean): Promise<Message>
    async reply(content: EmbedType | EmbedBuilder, reply?: boolean, mention?: boolean): Promise<Message>
    async reply(content: (EmbedType | EmbedBuilder)[], reply?: boolean, mention?: boolean): Promise<Message>
    async reply(content: string | EmbedType | EmbedBuilder | (EmbedType | EmbedBuilder)[], reply = false, mention = true): Promise<Message> {
        let msg = (typeof content == "string" ? { content } : { embeds: [content].flat() }) as MessageCreateParamsType
        if (reply) {
            msg.message_reference = {
                channel_id: this.channel.data.id,
                message_id: this.data.id
            }
            msg.allowed_mentions = { replied_user: mention }
        }
        return this.channel.sendMessage(msg)
    }
    /** Deletes message. */
    async delete(): Promise<boolean> {
        return this.channel.deleteMessage(this.data.id)
    }
    /** Edits a message. */
    async edit(data: (MessageEditParamsType | string)): Promise<Message> {
        if (typeof data !== "string" && data.embeds) data.embeds.map((embed: any) => embed.end ? embed.end() : embed) as EmbedType[]
        return this.channel.editMessage(this.data.id, data)
    }
    /** Reacts to a message with emoji */
    async react(emoji: string): Promise<boolean> {
        return this.channel.react(this.data.id, emoji)
    }
    /** Deletes previously added reaction from a message. */
    async unreact(emoji: string, user?: Snowflake): Promise<boolean> {
        return this.channel.unreact(this.data.id, emoji, user)
    }
    /** Deletes all previously added reaction from a message. */
    async unreactAll(emoji?: string): Promise<boolean> {
        return this.channel.unreactAll(this.data.id, emoji)
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
    /** Pins a message. */
    async pin(): Promise<boolean> {
        return this.channel.pin(this.data.id)
    }

    toString() {
        return `Message {"data":${JSON.stringify(this.data)},"channel":{"data":${JSON.stringify(this.channel.data)}},"guild":${this.guild ? `{"data":${JSON.stringify(this.guild.data)}}` : "undefined"}}`
    }
}
