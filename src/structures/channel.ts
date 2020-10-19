import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { MessageType } from "../types/message.ts"
import { Message } from "./message.ts";
import { MessageCreateParamsType, MessageEditParamsType, MessageTypeData } from "../types/message.ts";
import { Guild } from "./guild.ts";

export class Channel {
  data: ChannelType;
  client: Client;
  guild?: Guild;

  constructor(data: ChannelType, client: Client, guild?: Guild) {
    this.data = data;
    this.client = client;
    this.guild = guild
  }

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

  async deleteMessage(id: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}`, null, false)
    return response.status == 204 ? true : false;
  }

  async editMessage(id: string, data: (MessageEditParamsType | string)): Promise<Message> {
    if (!id) throw Error("Message ID not provided")
    if (typeof data == "string") data = { content: data }
    let json = await this.client._fetch<MessageType>("PATCH", `channels/${this.data.id}/messages/${id}`, JSON.stringify(data), true)
    return new Message(json, this.client, this, this.guild)
  }

  async react(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("PUT", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false);
    return response.status == 204 ? true : false;
  }

  async unreact(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`, null, false)
    return response.status == 204 ? true : false;
  }
}