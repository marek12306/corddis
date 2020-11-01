import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { MessageType } from "../types/message.ts"
import { Message } from "./message.ts";
import { MessageCreateParamsType, MessageEditParamsType, MessageTypeData } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { Me } from "../client/me.ts";

export class Channel {
  data: ChannelType;
  client: Client;
  guild?: Guild;
  /**
   * Creates a channel instance.
   * @class
   * @param {ChannelType} data raw data from Discord API
   * @param {Client} client client instance
   * @param {Guild} [guild] the guild from which the channel is
   */
  constructor(data: ChannelType, client: Client, guild?: Guild) {
    this.data = data;
    this.client = client;
    this.guild = guild
  }
  /**
   * Sends message to text channel.
   * @example
   * channel.sendMessage({
   *     content: "Hello!"
   * })
   * @param {MessageCreateParamsType} data raw message data to send
   * @returns {Promise<Message>} message that was sent
   */
  async sendMessage(data: MessageCreateParamsType): Promise<Message> {
    if (!data) throw Error("Content for message is not provided");
    let body;
    if (data?.file) {
      body = new FormData();
      body.append("file", data.file.content, data.file.name)
      body.append("payload_json", JSON.stringify({ ...data, file: undefined }))
    } else {
      body = JSON.stringify(data)
    }
    const json = await this.client._fetch<MessageType>("POST", `channels/${this.data.id}/messages`, body, true, data?.file ? false : "application/json")
    return new Message(json, this.client, this, this.guild);
  }
  /**
   * Fetches a message from channel.
   * @param {string} id message ID
   * @returns {Promise<Message>} fetched message
   */
  async fetchMessage(id: string): Promise<Message> {
    if (this.client.cache.has(id)) return this.client.cache.get(id) as Message
    const json = await this.client._fetch<MessageType>("GET", `channels/${this.data.id}/messages/${id}`, null, true)
    const message = new Message(json, this.client, this, this.guild)
    this.client.cache.set(id, message)
    return message
  }
  /**
   * Deletes a message.
   * @param {string} id message ID
   * @returns {Promise<boolean>} true if task was successful
   */
  async deleteMessage(id: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}`, null, false)
    return response.status == 204 ? true : false;
  }
  /**
   * Edits a previously sent message.
   * @param {id} id message ID
   * @param {MessageEditParamsType|string} data message content or raw message data
   * @returns {Promise<Message>} message that was edited
   */
  async editMessage(id: string, data: (MessageEditParamsType | string)): Promise<Message> {
    if (!id) throw Error("Message ID not provided")
    if (typeof data == "string") data = { content: data }
    const json = await this.client._fetch<MessageType>("PATCH", `channels/${this.data.id}/messages/${id}`, JSON.stringify(data), true)
    return new Message(json, this.client, this, this.guild)
  }
  /**
   * Reacts to a message with emoji.
   * @param {string} id message ID
   * @param {string} emoji emoji ID
   * @returns {Promise<boolean>} true if reaction was added
   */
  async react(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("PUT", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false);
    return response.status == 204 ? true : false;
  }
  /**
   * Deletes previous added reaction from a message.
   * @param {string} id message ID
   * @param {string} emoji emoji ID
   * @returns {Promise<boolean>} true if reaction was removed
   */
  async unreact(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false)
    return response.status == 204 ? true : false;
  }

  toString() {
    return `Channel {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild?.data)}}}`
  }
}