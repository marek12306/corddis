import { Client } from "./../client/client.ts";
import { ChannelType } from "../types/channel.ts";
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

  toString() {
    return `Channel {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild?.data)}}}`
  }
}