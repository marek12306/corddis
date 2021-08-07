import { Client } from "../client/client.ts";
import { PermissionEnum, Permissions } from "../constants.ts";
import { GuildMemberType } from "../types/guild.ts";
import { RoleType } from "../types/role.ts";
import { PresenceType } from "../types/user.ts";
import { Guild } from "./guild.ts";

export class GuildMember {
    #client: Client
    data: GuildMemberType;
    guild: Guild;
    presence: PresenceType = {};

    constructor(data: GuildMemberType, guild: Guild, client: Client) {
        this.#client = client;
        this.data = data;
        this.guild = guild;
    }

    /** Checks if member has permission to do something. */
    async hasPermission(permission: PermissionEnum): Promise<boolean> {
        if (this.data.user?.id == this.guild.data.owner_id) return true;
        const roles = this.data.roles.map((id: string) => this.guild.data.roles.find((x: RoleType) => x.id == id)?.permissions)
            .filter((x: string | undefined) => x) as string[]
        const bits = roles.reduce((bits: bigint, permissionss: string) => bits | BigInt(permissionss), BigInt(0))
        if (bits & BigInt(Permissions.ADMINISTRATOR)) return true;
        return roles.every(() => bits & BigInt(Permissions[PermissionEnum[permission]]))
    }
    /** Changes member nickname */
    async nickname(name: string): Promise<boolean> {
        if (!this.data.user?.id) throw "User is not found in guild member data.";
        return this.guild.nickname(name, this.data.user.id)
    }
    /** Adds role to member. */
    async addRole(role_id: string): Promise<boolean> {
        if (!this.data.user?.id) throw "User is not found in guild member data.";
        return this.guild.addRole(this.data.user.id, role_id)
    }

    toString() {
        return `GuildMember {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild.data)}}}`
    }
}
