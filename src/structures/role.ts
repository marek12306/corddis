import { Guild } from "./guild.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { Client } from "../client/client.ts";

export class Role {
    data: RoleType
    guild: Guild
    client: Client
    [propName: string]: any;

    constructor(data: RoleType, client: Client, guild: Guild) {
        this.data = data
        this.guild = guild
        this.client = client
        for (const [key, value] of Object.entries(data)) {
          if(this[key] === undefined) this[key] = value
          else this.client.emit("debug", `Can't override '${key}', key arleady exists, leaving previous value`)
        }
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
