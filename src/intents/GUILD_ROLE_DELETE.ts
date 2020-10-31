import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { RoleType } from "../types/role.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, role_id } = data.d
    if (client.cache.has(guild_id)) {
        const guild = await client.cache.get(guild_id) as Guild
        const found = guild.data.roles.find((x: RoleType) => x.id == role_id)
        if (!found) return [role_id, guild]
        const index = guild.data.roles.indexOf(found)
        if (index != -1) guild.data.roles.splice(index, 1)
        client.cache.set(guild_id, guild)
        return [found, guild]
    } else {
        const guild = await client.get(EntityType.GUILD, guild_id) as Guild
        client.cache.set(guild_id, guild)
        return [role_id, guild]
    }
}