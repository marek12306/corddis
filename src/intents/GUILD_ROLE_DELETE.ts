import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { Role } from "../structures/role.ts"
import { RoleType } from "../types/role.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, role_id } = data.d
    if (client.cache.has(guild_id)) {
        const guild = await client.cache.get(guild_id) as Guild
        const foundRaw = guild.data.roles.find((x: RoleType) => x.id == role_id)
        const foundRole = guild.roles.find((x: Role) => x.data.id == role_id)
        if (foundRaw) {
            const index = guild.data.roles.indexOf(foundRaw)
            guild.data.roles.splice(index, 1)
        }
        if (foundRole) {
            const index = guild.roles.indexOf(foundRole)
            guild.roles.splice(index, 1)
            client.cache.set(guild_id, guild)
            return [foundRole, guild]
        }
        client.cache.set(guild_id, guild)
        return [role_id, guild]
    } else {
        const guild = await client.get(EntityType.GUILD, guild_id) as Guild
        client.cache.set(guild_id, guild)
        return [role_id, guild]
    }
}