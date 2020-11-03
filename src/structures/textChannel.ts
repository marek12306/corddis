import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { MessageType } from "../types/message.ts"
import { Message } from "./message.ts";
import { MessageCreateParamsType, MessageEditParamsType, MessageTypeData } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { Me } from "../client/me.ts";
import { Channel } from "./channel.ts"

export class TextChannel extends Channel {
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
        let body: FormData|string = JSON.stringify(data)
        if (data?.file) {
        body = new FormData();
        body.append("file", data.file.content, data.file.name)
        body.append("payload_json", JSON.stringify({ ...data, file: undefined }))
        }
        const json = await this.client._fetch<MessageType>("POST", `channels/${this.data.id}/messages`, body, true, data?.file ? false : "application/json")
        return new Message(json, this.client, this, this.guild);
    }
    /** Fetches a message from channel. */
    async fetchMessage(id: string): Promise<Message> {
        if (this.client.cache.has(id)) return this.client.cache.get(id) as Message
        const json = await this.client._fetch<MessageType>("GET", `channels/${this.data.id}/messages/${id}`, null, true)
        const message = new Message(json, this.client, this, this.guild)
        this.client.cache.set(id, message)
        return message
    }
    /** Deletes a message. */
    async deleteMessage(id: string): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}`, null, false)
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
    async unreact(id: string, emoji: string): Promise<boolean> {
        if (!id) throw Error("Message ID is not provided");
        const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false)
        return response.status == 204;
    }

    toString() {
        return `TextChannel {"data":${JSON.stringify(this.data)}}`
    }
}