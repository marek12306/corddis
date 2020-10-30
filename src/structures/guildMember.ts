import { Client } from "../client/client.ts";
import { PermissionEnum, permissions } from "../permissions.ts";
import { GuildMemberType } from "../types/guild.ts";
import { RoleType } from "../types/role.ts";
import { Guild } from "./guild.ts";

export class GuildMember {
    data: GuildMemberType;
    guild: Guild;
    client: Client;

    constructor(data: GuildMemberType, guild: Guild, client: Client) {
        this.data = data;
        this.guild = guild;
        this.client = client;
    }

    async hasPermission(permission: PermissionEnum): Promise<boolean> { 
        if (this.data.user?.id == this.guild.data.owner_id) return true;
        console.log(this.guild.data.roles)
        const roles = this.data.roles.map((id: string) => this.guild.data.roles.find((x: RoleType) => x.id == id)?.permissions)
            .filter((x: string|undefined) => x != undefined) as string[]
        const bits = roles.reduce((bits: any, permissionss: any) => {
            bits |= BigInt(permissionss)
            return bits
        }, BigInt(0))
        if (bits & BigInt(permissions.ADMINISTRATOR)) return true;
        return roles.every((p: string) =>  bits & BigInt(permissions[PermissionEnum[permission]]))
    }

    async nickname(name: string) {
        if (!this.data.user?.id) throw "User is not found in guild member data.";
        return this.guild.nickname(name, this.data.user.id)
    }

    async addRole(role_id: string) {
        if (!this.data.user?.id) throw "User is not found in guild member data.";
        return this.guild.addRole(this.data.user.id, role_id)
    }

    toString() {
        return `GuildMember {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild.data)}}}`
    }
}