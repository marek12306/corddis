import { GuildMemberType, GuildType, IconAttributesType, TemplateCreateType, TemplateType, UnavailableGuildType } from "../types/guild.ts";
import { ChannelCreateType, ChannelType } from "../types/channel.ts";
import { Channel } from "./channel.ts";
import { GuildMember } from "./guildMember.ts";
import { EntityType, Snowflake } from "../types/utils.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { fromUint8Array, lookup } from "../../deps.ts"
import { Emoji } from "./emoji.ts";
import { NewEmojiType } from "../types/emoji.ts";
import { Role } from "./role.ts";
import { ChannelStructures, Constants, Intents } from "../constants.ts";
import { Template } from "./template.ts";
import { Gateway } from "../client/gateway.ts";
import { Voice } from "./voice.ts";
import { ApplicationCommandRootType } from "../types/commands.ts";
import { Client } from "../client/client.ts";
import { InvitesManager, GuildMemberManager, ChannelsManager } from './managers.ts';

export class Guild {
  #client: Client
  data: GuildType;
  invites: InvitesManager
  members: GuildMemberManager
  channels: ChannelsManager
  roles: Map<Snowflake, Role> = new Map();
  template?: Template;
  gateway?: Gateway;
  voice: Voice;
  slashCommands: Map<Snowflake, ApplicationCommandRootType> = new Map();

  constructor(data: GuildType, client: Client) {
    this.#client = client;
    this.data = data;
    this.voice = new Voice(this.#client, this)
    data.roles.forEach((role: RoleType) => this.roles.set(role.id, new Role(role, client, this)))
    this.gateway = this.#client.shards.find((shard: Gateway) =>
      shard.guilds.some((unavailableGuild: UnavailableGuildType) => unavailableGuild.id == data.id)
    )
    if (client.intents.includes(Intents.GUILD_MEMBERS)) this.gateway?.requestGuildMembers(data.id)

    this.invites = new InvitesManager(this.#client, this)
    this.members = new GuildMemberManager(this.#client, this)
    this.channels = new ChannelsManager(this.#client, this)
  }

  /** Deletes a guild. */
  async delete(): Promise<boolean> {
    const status = (await this.#client._fetch<Response>("DELETE", `guilds/${this.data.id}`, null, false)).status
    if (status != 204) throw new Error(`Error ${status}`);
    this.#client.guilds.delete(this.data.id)
    return true;
  }

  /**
   * Creates a channel.
   * @return created channel
   */
  async createChannel(data: ChannelCreateType): Promise<Channel> {
    const json = await this.#client._fetch<ChannelType>("POST", `guilds/${this.data.id}/channels`, JSON.stringify(data), true)
    const channel = new ChannelStructures[json.type](json, this.#client, this);
    this.channels.set(json.id, channel)
    return channel
  }
  /** Deletes a channel. */
  async deleteChannel(id: Snowflake): Promise<boolean> {
    if (!this.channels.has(id)) throw Error("Channel is not found")
    return ((await this.channels.get(id)).delete()) ?? false;
  }
  /** Fetches guild template. */
  async fetchTemplate(refresh = false): Promise<Template> {
    if (!refresh && this.template) return this.template
    const json = await this.#client._fetch<TemplateType[]>("GET", `guilds/${this.data.id}/templates`, null, true)
    this.template = new Template(json[0], this.#client, this)
    return this.template
  }
  /** Creates a template. */
  async createTemplate(data: TemplateCreateType): Promise<Template> {
    const json = await this.#client._fetch<TemplateType>("POST", `guilds/${this.data.id}/templates`, JSON.stringify(data), true)
    this.template = new Template(json, this.#client, this)
    return this.template
  }
  /** Deletes template
   * @returns deleted template or undefined if there was no template
   */
  async deleteTemplate(): Promise<Template | undefined> {
    await this.fetchTemplate(true)
    //Check if there is arleady template to remove
    if (!this.template) return undefined
    await this.#client._fetch("DELETE", `guilds/${this.data.id}/templates/${this.template.data.code}`)
    const tempTemplate = this.template
    this.template = undefined
    return tempTemplate
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
    const response = await this.#client._fetch<Response>("DELETE", `users/@me/guilds/${this.data.id}`, null, false)
    return response.status == 204
  }
  /** Bans a member. */
  async ban(id: Snowflake, reason?: string): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.#client._fetch<Response>("PUT", `guilds/${this.data.id}/bans/${id}`, JSON.stringify({ reason }), false)
    return response.status == 204
  }
  /** Revokes a ban from user. */
  async unban(id: Snowflake): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.#client._fetch<Response>("DELETE", `guilds/${this.data.id}/bans/${id}`, null, false)
    return response.status == 204
  }
  /** Kicks a member from guild. */
  async kick(id: Snowflake): Promise<boolean> {
    if (!id) throw Error("Member ID is not provided");
    const response = await this.#client._fetch<Response>("DELETE", `guilds/${this.data.id}/members/${id}`, null, false)
    return response.status == 204
  }
  /**
   * Changes a bot or other member nickname.
   * @param nick nickname
   * @param id member (user) ID to change, defaults to client id
   */
  async nickname(nick: string, id?: Snowflake): Promise<boolean> {
    const response = await this.#client._fetch<Response>("PATCH", `guilds/${this.data.id}/members/${id ?? "@me"}${id ? "" : "/nick"}`, JSON.stringify({ nick }))
    return response.status == 200
  }
  /** Creates a role. */
  async createRole(role: RoleEditType): Promise<RoleType> {
    return await this.#client._fetch<RoleType>("POST", `guilds/${this.data.id}/roles`, JSON.stringify(role), true)
  }
  /** Edits a role. */
  async editRole(id: Snowflake, role: RoleEditType): Promise<Role> {
    const edited = await this.#client._fetch<RoleType>("PATCH", `guilds/${this.data.id}/roles/${id}`, JSON.stringify(role), true)
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles[foundRaw] = edited
    const foundRole = this.roles.get(id) as Role
    if (foundRole) {
      foundRole.data = edited
      this.roles.set(id, foundRole)
      return foundRole
    }
    const editedRole = new Role(edited, this.#client, this)
    this.roles.set(editedRole.data.id, editedRole)
    return editedRole
  }
  /** Edits a role. */
  async deleteRole(id: Snowflake): Promise<boolean> {
    const response = await this.#client._fetch<Response>("DELETE", `guilds/${this.data.id}/roles/${id}`, null, false)
    if (response.status != 204) return false
    const foundRaw = this.data.roles.findIndex((x: RoleType) => x.id == id)
    if (foundRaw >= 0) this.data.roles.splice(foundRaw, 1)
    this.roles.delete(id)
    return response.status == 204
  }
  /** Adds a new role to member. */
  async addRole(member_id: Snowflake, role_id: Snowflake): Promise<boolean> {
    const response = await this.#client._fetch<Response>("PUT", `guilds/${this.data.id}/members/${member_id}/roles/${role_id}`, null, false)
    return response.status == 204
  }
  /** Creates a new emoji. */
  async createEmoji(data: NewEmojiType): Promise<Emoji> {
    const response = await this.#client._fetch<Response>("POST", `guilds/${this.data.id}/emojis`, JSON.stringify({
      name: data.name, roles: data.roles, image: `data:${lookup(data.file_format)};base64,${fromUint8Array(data.image)}`
    }), false)
    return new Emoji(await response.json(), this.#client, this)
  }

  /** Registers a slash command. */
  async registerSlashCommand(command: ApplicationCommandRootType) {
    return this.#client.registerSlashCommand(command, this.data.id)
  }
  /** Unregisters a slash command. */
  async unregisterSlashCommand(id: Snowflake) {
    return this.#client.unregisterSlashCommand(id, this.data.id)
  }
  /** Fetches slash commands. */
  async fetchSlashCommands(refresh = false) {
    if (!refresh && this.slashCommands.size > 0) return Array.from(this.slashCommands.values())
    const commands = await this.#client.fetchSlashCommands(this.data.id)
    commands.forEach((data: ApplicationCommandRootType) => {
      if (data.id) this.slashCommands.set(data.id, data)
    })
    return Array.from(this.slashCommands.values())
  }

  toString() {
    return `Guild {"data":${JSON.stringify(this.data)}}`
  }
}
