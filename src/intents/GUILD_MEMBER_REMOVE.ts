import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(data.d.user, client)

    if (guild.members.length > 0) {
        const foundIndex = guild.members.findIndex((x: GuildMember) => x.data.user?.id == userObj.data.id)
        if (foundIndex < 0) return [userObj, guild]
        guild.members.splice(foundIndex, 1)
        client.cache.set(guild_id, guild)
    }

    return [userObj, guild]
}