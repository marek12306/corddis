import { Client } from "../client/client.ts"
import { RoleType } from "../types/role.ts"
import { Role } from "../structures/role.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, role } = data.d
    let guild
    if (client.cache.guilds.has(guild_id)) {
        guild = await client.guilds.get(guild_id)
        if (data.t == "GUILD_ROLE_CREATE") {
            guild.data.roles.push(role)
            guild.roles.set(role.id, new Role(role, client, guild))
        } else {
            guild.data.roles = guild.data.roles.map((r: RoleType) => r.id == role.id ? role : r)
            const roleObj = guild.roles.get(role.id) as Role
            roleObj.data = role.data
            guild.roles.set(role.id, roleObj)
        }
        client.cache.guilds?.set(guild_id, guild)
    } else guild = await client.guilds.get(guild_id)
    return [guild]
}
