import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { RoleType } from "../types/role.ts"
import { Role } from "../structures/role.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, role } = data.d
    let guild
    if (client.cache.guilds?.has(guild_id)) {
        guild = client.cache.guilds?.get(guild_id) as Guild
        if (data.t == "GUILD_ROLE_CREATE") {
            guild.data.roles.push(role)
            for(const entry of guild.propNames) {
                // deno-lint-ignore no-explicit-any
                guild[entry] = (Object.entries(guild.data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
            }
            guild.roles.set(role.id, new Role(role, client, guild))
        } else {
            guild.data.roles = guild.data.roles.map((r: RoleType) => r.id == role.id ? role : r)
            const roleObj = guild.roles.get(role.id) as Role
            roleObj.data = role.data
            for(const entry of roleObj.propNames) {
                // deno-lint-ignore no-explicit-any
                roleObj[entry] = (Object.entries(roleObj.data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
            }
            guild.roles.set(role.id, roleObj)
        }
        client.cache.guilds?.set(guild_id, guild)
    } else guild = await client.get(EntityType.GUILD, guild_id) as Guild
    return [guild]
}