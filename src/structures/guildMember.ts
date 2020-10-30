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
        return roles.every((p: string) => {
            console.log(permission.toString(), bits, permissions[permission.toString()])
            bits & BigInt(permissions[permission.toString()])
        })
    }

    toString() {
        return `GuildMember {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild.data)}}}`
    }
}