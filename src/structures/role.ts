import { Guild } from "./guild.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { Client } from "../client/client.ts";

export class Role {
  #client: Client
  data: RoleType
  guild: Guild

  constructor(data: RoleType, client: Client, guild: Guild) {
    this.#client = client
    this.data = data
    this.guild = guild
  }

  /** Deletes a role. */
  async delete(): Promise<boolean> {
    return this.guild.deleteRole(this.data.id)
  }
  /** Edits a role. */
  async edit(data: RoleEditType): Promise<Role> {
    this.data = (await this.guild.editRole(this.data.id, data)).data
    return this
  }

  toString() {
    return `Role {"data":${JSON.stringify(this.data)}}`
  }
}
