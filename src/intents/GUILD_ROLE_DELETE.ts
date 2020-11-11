import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { Role } from "../structures/role.ts"
import { RoleType } from "../types/role.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, role_id } = data.d
    let guild;
    if (client.cache.guilds?.has(guild_id)) {
        guild = await client.cache.guilds?.get(guild_id) as Guild
        const foundRawIndex = guild.data.roles.findIndex((x: RoleType) => x.id == role_id)
        const foundRole = guild.roles.find((x: Role) => x.data.id == role_id)
        if (foundRawIndex > -1) guild.data.roles.splice(foundRawIndex, 1)
        if (foundRole) {
            const index = guild.roles.indexOf(foundRole)
            guild.roles.splice(index, 1)
            client.cache.guilds?.set(guild_id, guild)
            return [foundRole, guild]
        }
    } else guild = await client.get(EntityType.GUILD, guild_id) as Guild
    client.cache.guilds?.set(guild_id, guild)
    return [role_id, guild]
}