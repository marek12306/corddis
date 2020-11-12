import { GuildMemberType, GuildType, GuildUpdateType, IconAttributesType, InviteType } from "../types/guild.ts";
import { ChannelCreateType, ChannelType } from "../types/channel.ts";
import { Client } from "./../client/client.ts";
import { Channel } from "./channel.ts";
import { GuildMember } from "./guildMember.ts";
import { EntityType, ErrorType, Snowflake } from "../types/utils.ts";
import { User } from "./user.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { fromUint8Array, lookup } from "../../deps.ts"
import { Emoji } from "./emoji.ts";
import { NewEmojiType } from "../types/emoji.ts";
import { Invite } from "./invite.ts";
import { Role } from "./role.ts";
import { ChannelStructures, Constants, Intents } from "../constants.ts";

export class Guild {
  data: GuildType;
  client: Client;
  invites: Map<Snowflake, Invite> = new Map();
  members: Map<Snowflake, GuildMember> = new Map();
  channels: Map<Snowflake, Channel> = new Map();
  roles: Map<Snowflake, Role> = new Map();

  constructor(data: GuildType, client: Client) {
    this.data = data;
    this.client = client;
    data.roles.forEach((r: RoleType) => this.roles.set(r.id, new Role(r, client, this)))

    if (client.intents.includes(Intents.GUILD_MEMBERS)) client.requestGuildMembers(data.id)
  }
  /**
   * Updates a guild.
   * @return updated guild
   */
  async update(data: GuildUpdateType): Promise<Guild> {
    const guild = await this.client._fetch<GuildType>("PATCH", `guilds/${this.data.id}`, JSON.stringify(data), true)
    return new Guild(guild, this.client);
  }
  /** Deletes a guild. */
  async delete(): Promise<boolean> {
    const resp = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}`, null, false)
    if (resp.status != 204) throw new Error(`Error ${resp.status}`);
    return true;
  }
  /** Fetches all channels in guild (or gets them from cache). */
  async fetchChannels(): Promise<Channel[]> {
    if (this.channels.size > 0) return Array.from(this.channels.values())
    const json = await this.client._fetch<ChannelType[]>("GET", `guilds/${this.data.id}/channels`, null, true)
    json.forEach((data: ChannelType) => this.channels.set(data.id, new ChannelStructures[data.type](data, this.client, this)))
    return Array.from(this.channels.values())
  }
  /**
   * Fetches all members from guild.
   * @param refresh chooses whether to update the cache or not
   * @param limit limit of members to fetch
   * @param after after which member to fetch
   */
  async fetchMembers(limit = 1, after: Snowflake = "0", refresh = false): Promise<GuildMember[]> {
    if (!refresh && this.members.size > 0) return Array.from(this.members.values())
    const json = await this.client._fetch<GuildMemberType[]>("GET", `guilds/${this.data.id}/members?limit=${limit}&after=${after}`, null, true)
    json.forEach((data: GuildMemberType) => {if (data.user) this.members.set(data.user.id, new GuildMember(data, this, this.client))})
    return Array.from(this.members.values())
  }
  /**
   * Fetches guild entites from Discord API
   * @param type type of entity to fetch
   */
  async get(type: EntityType, id: Snowflake, refresh = false): Promise<GuildMember | Channel | Role | undefined> {
    switch (type) {
      // deno-lint-ignore no-case-declarations
      case EntityType.GUILD_MEMBER:
        if (this.members.has(id) && !refresh) return this.members.get(id) as GuildMember
        const json = await this.client._fetch<GuildMemberType>("GET", `guilds/${this.data.id}/members/${id}`, null, true)
        const member = new GuildMember(json, this, this.client)
        this.members.set(id, member)
        return member
      case EntityType.CHANNEL:
        await this.fetchChannels()
        return this.channels.get(id) as Channel;
      case EntityType.ROLE:
        return this.roles.get(id) as Role
      default:
        throw Error("Wrong EntityType")
    }
  }
  /** Checks if the item is a user. */
  isUser(item: any): item is User {
    return (item as User).isMe() !== undefined
  }
  /**
   * Creates a channel.
   * @return created channel
   */
  async createChannel(data: ChannelCreateType): Promise<Channel> {
    const json = await this.client._fetch<ChannelType>("POST", `guilds/${this.data.id}/channels`, JSON.stringify(data), true)
    return new ChannelStructures[json.type](json, this.client, this);
  }
  /** Generates a guild icon URL. */
  async icon(attr: IconAttributesType = {}): Promise<string> {
    if (attr.size && Constants.IMAGE_SIZES.includes(attr.size))
      throw new Error(`Size must be one of ${Constants.IMAGE_SIZES.join(", ")}`);
    if (attr.format && Constants.IMAGE_FORMATS.includes(attr.format))
      throw new Error(`Format must be one of ${Constants.IMAGE_FORMATS.join(", ")}`);

    return `https://cdn.discordapp.com/icons/${this.data.id}/${this.data.icon}.${'png' ?? attr.format}?size=${4096 ?? attr.size}`
  }
  /** Leaves from guild. */
  async leave(): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `users/@me/guilds/${this.data.id}`, null, false)
    return response.status == 204
  }
  /** Bans a member. */
  async ban(id: Snowflake, reason?: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("PUT", `guilds/${this.data.id}/bans/${id}`, JSON.stringify({ reason }), false)
    return response.status == 204
  }
  /** Revokes a ban from user. */
  async unban(id: Snowflake): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/bans/${id}`, null, false)
    return response.status == 204
  }
  /** Kicks a member from guild. */
  async kick(id: Snowflake): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/members/${id}`, null, false)
    return response.status == 204
  }
  /**
   * Changes a bot or other member nickname.
   * @param nick nickname
   * @param id member (user) ID to change, defaults to bot 
   */
  async nickname(nick: string, id?: Snowflake): Promise<boolean> {
    const response = await this.client._fetch<Response>("PATCH", `guilds/${this.data.id}/members/${id ?? "@me"}${id ? "" : "/nick"}`, JSON.stringify({ nick }), false)
    return response.status == 200
  }
  /** Creates a role. */
  async createRole(role: RoleEditType): Promise<RoleType> {
    return await this.client._fetch<RoleType>("POST", `guilds/${this.data.id}/roles`, JSON.stringify(role), true)
  }
  /** Edits a role. */
  async editRole(id: Snowflake, role: RoleEditType): Promise<Role> {
    const edited = await this.client._fetch<RoleType>("PATCH", `guilds/${this.data.id}/roles/${id}`, JSON.stringify(role), true)
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles[foundRaw] = edited 
    const foundRole = this.roles.get(id) as Role
    if (foundRole) {
      foundRole.data = edited
      this.roles.set(id, foundRole)
      return foundRole
    }
    const editedRole = new Role(edited, this.client, this)
    this.roles.set(editedRole.data.id, editedRole)
    return editedRole
  }
  /** Edits a role. */
  async deleteRole(id: Snowflake): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `guilds/${this.data.id}/roles/${id}`, null, false)
    if (response.status != 204) return false
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles.splice(foundRaw, 1)
    this.roles.delete(id)
    return response.status == 204
  }
  /** Fetches all guild invites. */
  async fetchInvites(): Promise<Invite[]> {
    const invites = await this.client._fetch<InviteType[]>("GET", `guilds/${this.data.id}/invites`, null, true)
    invites.forEach((x: InviteType) => this.invites.set(x.code, new Invite(x, this.client, this)))
    if (this.client.cache.invites) this.invites.forEach(x => this.client.cache.invites?.set((x as Invite).data.code, x))
    return Array.from(this.invites.values())
  }
  /** Adds a new role to member. */
  async addRole(member_id: Snowflake, role_id: Snowflake): Promise<boolean> {
    const response = await this.client._fetch<Response>("PUT", `guilds/${this.data.id}/members/${member_id}/roles/${role_id}`, null, false)
    return response.status == 204
  }
  /** Creates a new emoji. */
  async createEmoji(data: NewEmojiType): Promise<Emoji> {
    const response = await this.client._fetch<Response>("POST", `guilds/${this.data.id}/emojis`, JSON.stringify({
      name: data.name, roles: data.roles, image: `data:${lookup(data.file_format)};base64,${fromUint8Array(data.image)}`
    }), false)
    return new Emoji(await response.json(), this.client, this)
  }

  toString() {
    return `Guild {"data":${JSON.stringify(this.data)}}`
  }
}