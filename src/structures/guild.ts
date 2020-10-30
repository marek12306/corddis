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
    const guild = await this.client._fetch<GuildType>("PATCH", `guilds/${this.data.id}`, JSON.stringify(data), true)
    return new Guild(guild, this.client);
  }

  async delete(): Promise<boolean> {
    const resp = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}`, null, false)
    if (resp.status != 204) throw new Error(`Error ${resp.status}`);
    return true;
  }

  async channels(): Promise<Channel[]> {
    if (this.client.cache.has(`${this.data.id}ch`)) return this.client.cache.get(`${this.data.id}ch`) as Channel[]
    const json = await this.client._fetch<ChannelType[]>("GET", `guilds/${this.data.id}/channels`, null, true)
    this.client.cache.set(`${this.data.id}ch`, json.map((data: ChannelType) => new Channel(data, this.client, this)))
    return this.client.cache.get(`${this.data.id}ch`) as Channel[];
  }

  async members(limit: number = 1, after: Snowflake = "0"): Promise<GuildMember[]> {
    if (this.client.cache.has(`${this.data.id}mem`)) return this.client.cache.get(`${this.data.id}mem`) as GuildMember[]
    const json = await this.client._fetch<GuildMemberType[]>("GET", `guilds/${this.data.id}/members?limit=${limit}&after=${after}`, null, true)
    this.client.cache.set(`${this.data.id}mem`, json.map((data: GuildMemberType) => new GuildMember(data, this, this.client)))
    return this.client.cache.get(`${this.data.id}mem`) as GuildMember[];
  }

  async addMember(token: string, userId: Snowflake | User, nick: string = "", roles: Snowflake[] = [], mute: boolean = false, deaf: boolean = false): Promise<GuildMember> {
    if (!this.client.user) throw Error("Invalid user token")
    if (this.isUser(userId)) userId = (userId as User).data.id
    const resp = await this.client._fetch<Response>("GET", `guilds/${this.data.id}/members/${userId}`, JSON.stringify({ accessToken: token, nick, roles, mute, deaf }), false)
    if ((await resp.text()).length == 0) return (await this.get(EntityType.USER, userId)) as GuildMember;
    return new GuildMember(await resp.json(), this, this.client);
  }

  async get(type: EntityType, id: Snowflake): Promise<GuildMember | Channel> {
    switch (type) {
      // deno-lint-ignore no-case-declarations
      case EntityType.GUILD_MEMBER:
        const user = await this.client._fetch<GuildMemberType>("GET", `guilds/${this.data.id}/members/${id}`, null, true)
        this.client.cache.set(`${type}${id}`, new GuildMember(user, this, this.client))
        return this.client.cache.get(`${type}${id}`) as GuildMember|Channel;
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
    const json = await this.client._fetch<ChannelType>("POST", `guilds/${this.data.id}/channels`, JSON.stringify(data), true)
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
    const response = await this.client._fetch<Response>("DELETE", `users/@me/guilds/${this.data.id}`, null, false)
    return response.status == 204 ? true : false;
  }

  async ban(id: string, reason?: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("PUT", `guilds/${this.data.id}/bans/${id}`, JSON.stringify({ reason }), false)
    return response.status == 204 ? true : false;
  }

  async unban(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/bans/${id}`, null, false)
    return response.status == 204 ? true : false;
  }

  async kick(id: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/members/${id}`, null, false)
    return response.status == 204 ? true : false;
  }

  async nickname(nick: string, id?: string): Promise<boolean> {
    const response = await this.client._fetch<Response>("PATCH", `guilds/${this.data.id}/members/${id ?? "@me"}${id ? "" : "/nick"}`, JSON.stringify({ nick }), false)
    return response.status == 200 ? true : false
  }

  toString() {
    return `Guild {"data":${JSON.stringify(this.data)}}`
  }
}