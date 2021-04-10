import { Client } from "../client/client.ts"
import { Role } from "../structures/role.ts"
import { RoleType } from "../types/role.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, role_id } = data.d
    let guild;
    if (client.cache.guilds?.has(guild_id)) {
        guild = await client.guilds.get(guild_id)
        const foundRawIndex = guild.data.roles.findIndex((x: RoleType) => x.id == role_id)
        if (foundRawIndex > -1) guild.data.roles.splice(foundRawIndex, 1)
        const foundRole = guild.roles.get(role_id) as Role
        if (foundRole) {
            guild.roles.delete(role_id)
            client.cache.guilds?.set(guild_id, guild)
            return [foundRole, guild]
        }
    } else guild = await client.guilds.get(guild_id)
    client.cache.guilds?.set(guild_id, guild)
    return {role: role_id, guild}
}