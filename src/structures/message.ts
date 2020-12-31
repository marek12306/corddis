import { Client } from "./../client/client.ts";
import { MessageType, MessageEditParamsType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { TextChannel } from "./textChannel.ts";
import { NewsChannel } from "./newsChannel.ts"
import { ChannelTypeData } from "../types/channel.ts";
import { EmbedType } from "../types/embed.ts";
import EmbedBuilder from "../embed.ts";
import { Base } from "./base.ts";

export class Message extends Base {
    data: MessageType;
    channel: NewsChannel | TextChannel;
    guild?: Guild;
    propNames: string[] = [];
    // deno-lint-ignore no-explicit-any
    [propName: string]: any;

    constructor(data: MessageType, client: Client, channel: NewsChannel | TextChannel, guild?: Guild) {
        super(client);
        this.data = data;
        this.channel = channel;
        this.guild = guild;
        this.setBase()
    }

    protected setBase(data: MessageType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; this.propNames.push(key)}
      }
    }

    protected updateBase(data: MessageType = this.data): void {
      for(const entry of this.propNames) {
        // deno-lint-ignore no-explicit-any
        this[entry] = (Object.entries(data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
      }
    }

    /** Replies to a message with some text content or an embed. */
    async reply(content: string | EmbedType | EmbedBuilder): Promise<Message> {
        if (typeof content == "string") {
            return this.channel.sendMessage({ content })
        } else return this.channel.sendMessage({ embed: content })
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
        this.updateBase()
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
