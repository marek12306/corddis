import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { RoleType } from "../types/role.ts"
import { Role } from "../structures/role.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, role } = data.d
    let guild
    if (client.cache.has(guild_id)) {
        guild = client.cache.get(guild_id) as Guild
        if (data.t == "GUILD_ROLE_CREATE") {
            guild.data.roles.push(role)
            guild.roles.push(new Role(role, client, guild))
        } else {
            guild.data.roles = guild.data.roles.map((r: RoleType) => 
                r.id == role.id ? role : r
            )
            guild.roles = guild.roles.map((r: Role) => {
                if (r.data.id != role.id) return r
                r.data = role.data
                return r
            })
        }
        client.cache.set(guild_id, guild)
        return [guild]
    } else {
        guild = await client.get(EntityType.GUILD, guild_id) as Guild
        return [guild]
    }
}