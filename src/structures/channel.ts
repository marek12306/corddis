import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { Message } from "./message.ts";
import { MessageCreateParamsType } from "../types/message.ts";

export class Channel {
  data: ChannelType;
  client: Client;

  constructor(data: ChannelType, client: Client) {
    this.data = data;
    this.client = client;
  }

  async sendMessage(data: MessageCreateParamsType): Promise<Message> {
    if (!data) throw Error("Content for message is not provided");
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages`),
      this.client._options("POST", JSON.stringify(data))
    );
    let json = await response.json()
    return new Message(json, this.client);
  }

  async deleteMessage(id: string): Promise<boolean> {
    if (!id) throw Error("Message ID is not provided");
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/messages/${id}`),
      this.client._options("DELETE")
    );
    return response.status == 204 ? true : false;
  }
}
