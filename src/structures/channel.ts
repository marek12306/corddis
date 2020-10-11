import { Client } from "../client.ts";
import { ChannelType } from "../types/channel.ts";

export class Channel {
  data: ChannelType;
  client: Client;

  constructor(data: ChannelType, client: Client) {
    this.data = data;
    this.client = client;
  }
}
