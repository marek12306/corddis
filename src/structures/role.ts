import { Guild } from "./guild.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { Client } from "../client/client.ts";

export class Role {
    data: RoleType
    guild: Guild
    client: Client
    /**
     * Creates a role instance.
     * @param {RoleType} data raw data from Discord API
     * @param {Client} client client instance
     * @param {Guild} guild the guild from which the role is from
     */
    constructor(data: RoleType, client: Client, guild: Guild) {
        this.data = data
        this.guild = guild
        this.client = client
    }
    /**
     * Deletes a role.
     * @returns {Promise<boolean>} true if task was successful
     */
    async delete(): Promise<boolean> {
        return this.guild.deleteRole(this.data.id)
    }
    /**
     * Edits a role.
     * @param {RoleEditType} data raw data to send
     * @returns {Promise<Role>} edited role
     */
    async edit(data: RoleEditType): Promise<Role> {
        const edited = await this.guild.editRole(this.data.id, data)
        this.data = edited.data
        return this
    }

    toString() {
        return `Role {"data":${JSON.stringify(this.data)}}`
    }
}