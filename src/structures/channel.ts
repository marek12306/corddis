import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { Message } from "./message.ts";
import { MessageCreateParamsType, MessageEditParamsType } from "../types/message.ts";
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
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages`),
      this.client._options("POST", JSON.stringify(data))
    );
    let json = await response.json();
    return new Message(json, this.client, this);
  }

  async sendFile(data: MessageCreateParamsType, filename: string = "file.jpg"): Promise<Message> {
    if (!data) throw Error("Content for message is not provided");
    const body = Object.keys(data).reduce((form, key) => {
      form.append(key, (data as any)[key]);
      return form;
    }, new FormData())
    console.log(body)
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages`),
      this.client._options("POST", body, "multipart/form-data", {
        "Content-Disposition": filename ? "filename=" + filename : ""
      })
    );
    let json = await response.json();
    return new Message(json, this.client, this);
  }

  async deleteMessage(id: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages/${id}`),
      this.client._options("DELETE")
    );
    return response.status == 204 ? true : false;
  }

  async editMessage(id: string, data: (MessageEditParamsType | string)): Promise<Message> {
    if (!id) throw Error("Message ID not provided")
    if (typeof data == "string") {
      data = { content: data }
    }
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages/${id}`),
      this.client._options("PATCH", JSON.stringify(data))
    );
    let json = await response.json()
    return new Message(json, this.client, this)
  }

  async react(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`),
      this.client._options("PUT")
    );
    return response.status == 204 ? true : false;
  }

   async unreact(id: string, emoji: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages/${id}/reactions/${encodeURIComponent(emoji)}/@me`),
      this.client._options("DELETE")
    );
    return response.status == 204 ? true : false;
  }
}
