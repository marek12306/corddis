import { GuildMemberType, GuildType, GuildUpdateType, IconAttributesType } from "../types/guild.ts";
import { ChannelCreateType, ChannelType } from "../types/channel.ts";
import { Client } from "./../client/client.ts";
import { Channel } from "./channel.ts";
import { GuildMember } from "./guildMember.ts";
import { EntityType, Snowflake } from "../types/utils.ts";
import { User } from "./user.ts";

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
    return json.map((data: ChannelType) => new Channel(data, this.client, this));
  }

  async members(limit: number = 1, after: Snowflake = "0"): Promise<GuildMember[]> {
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}/members?limit=${limit}&after=${after}`),
      this.client._options("GET"),
    );
    let json = await resp.json();
    return json.map((data: GuildMemberType) => new GuildMember(data, this.client));
  }

  async addMember(token: String, userId: Snowflake | User, nick: String = "", roles: Snowflake[] = [], mute: boolean = false, deaf: boolean = false): Promise<GuildMember> {
    if (!this.client.user) throw Error("Invalid user token")
    if (this.isUser(userId)) userId = (userId as User).data.id
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}/members/${userId}`),
      this.client._options("GET", JSON.stringify({ accessToken: token, nick, roles, mute, deaf }))
    );
    if ((await resp.text()).length == 0) return (await this.get(EntityType.USER, userId)) as GuildMember;
    return new GuildMember(await resp.json(), this.client);
  }

  async get(type: EntityType, id: Snowflake): Promise<GuildMember | Channel> {
    var response;
    switch (type) {
      case EntityType.GUILD_MEMBER:
        response = await fetch(
          this.client._path(`/users/${id}`),
          this.client._options("GET"));
        let user = await response.json();
        return new GuildMember(user, this.client);
      case EntityType.CHANNEL:
        return (await this.channels()).find(ch => ch.data.id == id) as Channel;
      default:
        throw Error("Wrong EntityType")
    }
  }

  isUser(item: any): item is User {
    return (item as User).isMe() !== undefined
  }

  async createChannel(data: ChannelCreateType): Promise<Channel> {
    let resp = await fetch(
      this.client._path(`/guilds/${this.data.id}/channels`),
      this.client._options("POST", JSON.stringify(data)),
    );
    let json = await resp.json();
    return new Channel(json, this.client, this);
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

  async ban(id: string, reason?: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    let response = await fetch(
      this.client._path(`/guilds/${this.data.id}/bans/${id}`),
      this.client._options("PUT", JSON.stringify({ reason }))
    );
    return response.status == 204 ? true : false;
  }
 
  async unban(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    let response = await fetch(
      this.client._path(`/guilds/${this.data.id}/bans/${id}`),
      this.client._options("DELETE")
    );
    return response.status == 204 ? true : false;
  }

  async kick(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    let response = await fetch(
      this.client._path(`/guilds/${this.data.id}/members/${id}`),
      this.client._options("DELETE")
    );
    return response.status == 204 ? true : false;
  }
}