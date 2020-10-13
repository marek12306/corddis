import { GuildType, GuildUpdateType, IconAttributesType } from "../types/guild.ts";
import { ChannelCreateType, ChannelType } from "../types/channel.ts";
import { Client } from "./../client/client.ts";
import { Channel } from "./channel.ts";

export class Guild {
  data: GuildType;
  client: Client;

  constructor(data: GuildType, client: Client) {
    this.data = data;
    this.client = client;
  }

  async update(data: GuildUpdateType): Promise<Guild> {
    let response = await fetch(
      this.client._path(`/guilds/${this.data.id}`),
      this.client._options("PATCH", JSON.stringify(data)),
    );
    let guild = await response.json();
    return new Guild(guild, this.client);
  }

  async delete(): Promise<boolean> {
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}`),
      this.client._options("DELETE"),
    );

    if (resp.status != 204) {
      throw new Error(`Error ${resp.status}`);
    }

    return true;
  }

  async channels(): Promise<Channel[]> {
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}/channels`),
      this.client._options("GET"),
    );
    let json = await resp.json();
    return json.map((data: ChannelType) => new Channel(data, this.client));
  }

  async createChannel(data: ChannelCreateType): Promise<Channel> {
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}/channels`),
      this.client._options("POST", JSON.stringify(data)),
    );
    let json = await resp.json();
    return new Channel(json, this.client);
  }

  async icon(attr: IconAttributesType = {}): Promise<string> {
    if (attr.size && this.client.constants.IMAGE_SIZES.includes(attr.size))
      throw new Error(`Size must be one of ${this.client.constants.IMAGE_SIZES.join(", ")}`);
    if (attr.format && this.client.constants.IMAGE_FORMATS.includes(attr.format))
      throw new Error(`Format must be one of ${this.client.constants.IMAGE_FORMATS.join(", ")}`);

    return `https://cdn.discordapp.com/icons/${this.data.id}/${this.data.icon}.${'png' ?? attr.format}?size=${4096 ?? attr.size}`
  }

  async leave(): Promise<boolean> {
    let response = await fetch(
      this.client._path(`/users/@me/guilds/${this.data.id}`),
      this.client._options("DELETE"),
    );
    return await response.text().then(value => value == "" ? true : false)
  }
}
