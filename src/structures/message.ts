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
    /**
     * Creates a Message instance.
     * @class
     * @param {MessageType} data raw data from Discord API
     * @param {Client} client client instance
     * @param {Channel} channel the channel from which the message was sent
     * @param {Guild} guild the guild from which the message was sent
     */
    constructor(data: MessageType, client: Client, channel: Channel, guild?: Guild) {
        this.data = data;
        this.client = client;
        this.channel = channel;
        this.guild = guild;
    }
    /**
     * Replies to a message with some text content.
     * @param {string} content message content
     * @returns {Promise<Message>} message that was sent
     */
    async reply(content: string): Promise<Message> {
        return this.channel.sendMessage({ content })
    }
    /**
     * Deletes message.
     * @returns {Promise<boolean>} true if task was successful
     */
    async delete(): Promise<boolean> {
        return this.channel.deleteMessage(this.data.id)
    }
    /**
     * Edits message.
     * @param {MessageEditParamsType|string} data raw message edit data to send or text content
     * @returns {Promise<Message>} edited message
     */
    async edit(data: (MessageEditParamsType | string)): Promise<Message> {
        return this.channel.editMessage(this.data.id, data)
    }
    /**
     * Reacts to a message with emoji
     * @param {string} emoji emoji
     * @returns {Promise<boolean>} true if task was successful
     */
    async react(emoji: string): Promise<boolean> {
        return this.channel.react(this.data.id, emoji)
    }
    /**
     * Deletes previously added reaction from a message.
     * @param {string} emoji emoji
     * @returns {Promise<boolean>} true if task was successful
     */
    async unreact(emoji: string): Promise<boolean> {
        return this.channel.unreact(this.data.id, emoji)
    }

    toString() {
        return `Message {"data":${JSON.stringify(this.data)},"channel":{"data":${JSON.stringify(this.channel.data)}},"guild":${this.guild ? `{"data":${JSON.stringify(this.guild.data)}}` : "undefined"}}`
    }
}