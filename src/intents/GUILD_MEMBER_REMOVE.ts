import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, user } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(user, client)

    if (guild.members.length > 0) {
        const found = guild.members.find((x: GuildMember) => x.data.user?.id == userObj.data.id)
        if (!found) return [userObj, guild]
        const index = guild.members.indexOf(found)
        guild.members.splice(index, 1)
        client.cache.set(guild_id, guild)
    } 
    
    return [userObj, guild]
}