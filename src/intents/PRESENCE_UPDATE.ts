import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { PresenceType } from "../types/user.ts"
import { GuildMember } from "../structures/guildMember.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    const presence = data.d as PresenceType
    let guild
    if (client.cache.guilds?.has(guild_id)) {
        guild = client.cache.guilds?.get(guild_id) as Guild
        if (!presence.user?.id) return [guild, data.d as PresenceType]
        const member = await guild.get(EntityType.GUILD_MEMBER, presence.user?.id) as GuildMember
        const foundIndex = guild.members.indexOf(member)
        if (foundIndex > -1) {
            guild.members[foundIndex].presence = { ...guild.members[foundIndex].presence, ...presence }
            client.cache.guilds?.set(guild_id, guild)
        }
    } else guild = await client.get(EntityType.GUILD, guild_id) as Guild
    return [guild, data.d as PresenceType]
}