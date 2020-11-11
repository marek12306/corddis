import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { User } from "../structures/user.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(data.d, client)
    if (guild.members.size > 0) {
        if (!guild.members.has(userObj.data.id)) return [userObj, guild]
        guild.members.delete(userObj.data.id)
        client.cache.guilds?.set(guild_id, guild)
    }
    return [userObj, guild]
}