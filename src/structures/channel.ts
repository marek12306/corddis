import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
import { Message } from "./message.ts";

export class Channel {
  data: ChannelType;
  client: Client;

  constructor(data: ChannelType, client: Client) {
    this.data = data;
    this.client = client;
  }

  // Dać parametr do wysyłania z https://discord.com/developers/docs/resources/channel#create-message
  async sendMessage(): Promise<Message> {
    let response = await fetch(
      this.client._path(`/channels/${this.data.id}/channels`),
      this.client._options("GET")
    );
    var message = await response.json()
    return new Message(message, this.client)
  }
}
