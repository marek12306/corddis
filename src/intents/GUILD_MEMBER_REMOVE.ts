import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(data.d.user, client)

    if (guild.members.size > 0) {
        if (!guild.members.has(userObj.data.id)) return [userObj, guild]
        guild.members.delete(userObj.data.id)
        client.cache.guilds?.set(guild_id, guild)
    }

    return [userObj, guild]
}