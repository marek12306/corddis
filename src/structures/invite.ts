import { Client } from "../client/client.ts";
import { InviteType } from "../types/guild.ts";
import { Guild } from "./guild.ts";
export class Invite {
  #client: Client
  data: InviteType
  guild?: Guild

  constructor(data: InviteType, client: Client, guild?: Guild) {
    this.#client = client
    this.data = data
    this.guild = guild
  }

  /**
   * Deletes a invite.
   * @return deleted invite
   */
  async delete(): Promise<Invite> {
    const response = await this.#client._fetch<Response>("DELETE", `invites/${this.data.code}`, null, false)
    this.#client.cache.invites?.delete(this.data.code)
    return this
  }

  toString() {
    return `Invite {"data":${JSON.stringify(this.data)}}`
  }
}
