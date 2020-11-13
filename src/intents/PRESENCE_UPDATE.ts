import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { PresenceType } from "../types/user.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    const presence = data.d as PresenceType
    let guild
    if (client.cache.guilds?.has(guild_id)) {
        guild = await client.get(EntityType.GUILD, guild_id) as Guild
        if (!presence.user?.id) return [guild, presence]
        const member = await guild.get(EntityType.GUILD_MEMBER, presence.user?.id) as GuildMember
        member.presence = { ...member.presence, ...presence }
        guild.members.set(data.d.user.id, member)
        client.cache.guilds?.set(guild_id, guild)
    } else guild = await client.get(EntityType.GUILD, guild_id) as Guild
    return [guild, presence]
}