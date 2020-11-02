import { Guild } from "./guild.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { Client } from "../client/client.ts";

export class Role {
    data: RoleType
    guild: Guild
    client: Client

    constructor(data: RoleType, client: Client, guild: Guild) {
        this.data = data
        this.guild = guild
        this.client = client
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