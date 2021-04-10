import { Client } from "./../client/client.ts";
import { ChannelModifyType, ChannelType, ChannelTypeData } from "../types/channel.ts";
import { Guild } from "./guild.ts";

export class Channel {
  protected client: Client
  data: ChannelType
  guild?: Guild

  constructor(data: ChannelType, client: Client, guild?: Guild) {
    this.data = data
    this.client = client
    this.guild = guild
  }

  /** Deletes a channel. */
  async delete(): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}`, null, false);
    this.guild?.channels.delete(this.data.id)
    return response.status == 204;
  }
  /** Modifies (edits) a channel. */
  async edit(data: ChannelModifyType): Promise<Channel> {
    this.data = await this.client._fetch<ChannelType>("PATCH", `channels/${this.data.id}`, JSON.stringify(data), true)
    return this
  }

  toString() {
    return `Channel {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild?.data)}}}`
  }
}
