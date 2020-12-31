import { Client } from "./../client/client.ts";
import { ChannelType, NewsFollowedChannelType } from "../types/channel.ts";
import { MessageFetchParamsType, MessageType } from "../types/message.ts"
import { WebhookType } from "../types/webhook.ts"
import { Message } from "./message.ts";
import { MessageCreateParamsType, MessageEditParamsType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { Channel } from "./channel.ts"
import { EmbedBuilder, Snowflake } from "../../mod.ts";
import { Webhook } from "./webhook.ts";

export class TextChannel extends Channel {
    pins: Message[] = [];
    pinsUpdated: Date | null = null
    pinsViewed: Date | null = null
    webhooks: Webhook[] = []

    constructor(data: ChannelType, client: Client, guild?: Guild) {
        super(data, client, guild)
    }
    /**
     * Sends message to text channel.
     *    channel.sendMessage({
     *        content: "Hello!"
     *    })
     */
    async sendMessage(data: MessageCreateParamsType): Promise<Message> {
        if (!data) throw Error("Content for message is not provided");
        if (data.embed && data.embed instanceof EmbedBuilder) data.embed = (data.embed as EmbedBuilder).end()
        let body: FormData | string = JSON.stringify(data)
        if (data?.file) {
            body = new FormData();
            body.append("file", data.file.content, data.file.name)
            body.append("payload_json", JSON.stringify({ ...data, file: undefined }))
        }
        const json = await this.client._fetch<MessageType>("POST", `channels/${this.data.id}/messages`, body, true, data?.file ? false : "application/json")
        return new Message(json, this.client, this, this.guild);
    }
    /** Sends a file to text channel. */
    async sendFile(path: string): Promise<Message> {
        const name = path.split('/').pop() ?? ""
        return this.sendMessage({
            file: {
                name, content: new Blob([await Deno.readFile(path)])
            }
        })
    }
    /** Fetches a message from channel. */
    async fetchMessage(id: string): Promise<Message> {
        if (this.client.cache.messages?.has(id)) return this.client.cache.messages.get(id) as Message
        const json = await this.client._fetch<MessageType>("GET", `channels/${this.data.id}/messages/${id}`, null, true)
        const message = new Message(json, this.client, this, this.guild)
        if (this.client.cache.messages) this.client.cache.messages.set(id, message)
        return message
    }
    /** Fetches messages from channel. */
    async fetchMessages(params: MessageFetchParamsType): Promise<Message[]> {
        const json = await this.client._fetch<MessageType[]>("GET", `channels/${this.data.id}/messages`, JSON.stringify(params), true)
        const messages: Message[] = []
        for (const message of json) {
            const messageObj = new Message(message, this.client, this, this.guild)
            if (this.client.cache.messages) this.client.cache.messages.set(message.id, messageObj)
            messages.push(messageObj)
        }
        return messages
    }
    /** Deletes a message. */
    async deleteMessage(id: string): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}`, null, false)
        return response.status == 204;
    }
    /** Deletes a message. */
    async deleteMessagesBulk(messages: Snowflake[]): Promise<boolean> {
        if (!messages) throw Error("Message IDs are not provided");
        const response = await this.client._fetch<Response>("POST", `channels/${this.data.id}/messages/bulk-delete`, JSON.stringify({
            messages
        }), false)
        return response.status == 204;
    }
    /** Edits a previously sent message. */
    async editMessage(id: string, data: (MessageEditParamsType | string)): Promise<Message> {
        if (!id) throw Error("Message ID not provided")
        if (typeof data == "string") data = { content: data }
        const json = await this.client._fetch<MessageType>("PATCH", `channels/${this.data.id}/messages/${id}`, JSON.stringify(data), true)
        return new Message(json, this.client, this, this.guild)
    }
    /** Reacts to a message with emoji. */
    async react(id: string, emoji: string): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("PUT", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false);
        return response.status == 204;
    }
    /** Deletes previous added reaction from a message. */
    async unreact(id: string, emoji: string, user?: Snowflake): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/${user ?? '@me'}`, null, false)
        return response.status == 204;
    }
    /** Deletes all previous added reaction from a message. */
    async unreactAll(id: string, emoji?: string): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}/reactions${emoji ? '/' + encodeURIComponent(emoji) : ''}`, null, false)
        return response.status == 204;
    }
    /** Fetch channel pins. */
    async fetchPins(): Promise<Message[]> {
        if (this.pinsUpdated && this.pinsViewed && this.pinsUpdated.getTime() < this.pinsViewed.getTime()) return this.pins
        const pins = await this.client._fetch<MessageType[]>("GET", `channels/${this.data.id}/pins`, null, true)
        this.pins = pins.map((x: MessageType) => new Message(x, this.client, this, this.guild))
        this.pinsUpdated = this.pinsViewed = new Date()
        return this.pins
    }
    /** Fetches channel webhooks. */
    async fetchWebhooks(): Promise<Webhook[]> {
        const webhooks = await this.client._fetch<WebhookType[]>("GET", `channels/${this.data.id}/webhooks`)
        this.webhooks = webhooks.map((x: WebhookType) => new Webhook(x))
        return this.webhooks
    }
    /** Pins a message. */
    async pin(id: Snowflake): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided")
        const response = await this.client._fetch<Response>("PUT", `channels/${this.data.id}/pins/${id}`, null, false)
        return response.status == 204
    }
    /** Triggers typing indicator. */
    async typing(): Promise<boolean> {
        const response = await this.client._fetch<Response>("POST", `channels/${this.data.id}/typing`, null, false)
        return response.status == 204
    }
    /** Crossposts a message */
    async crosspost(id: Snowflake): Promise<Message> { throw Error("Message channel is not a news channel") }
    /** Follows a news channel to another text channel. */
    async follow(webhook_channel_id: string): Promise<NewsFollowedChannelType> { throw Error("Message channel is not a news channel") }
    toString() {
        return `TextChannel {"data":${JSON.stringify(this.data)}}`
    }
}