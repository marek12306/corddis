import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { PresenceType } from "../types/user.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { members, guild_id, presences } = data.d

    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    for (const memberRaw of members) {
        const member = new GuildMember(memberRaw, guild, client)

        if (!member.data.user?.id) continue
        if (presences) {
            const presence = presences.find((x: PresenceType) => x.user?.id == member.data.user?.id)
            if (presence) member.presence = presence
        }

        guild.members.set(member.data.user.id, member)
    }

    client.cache.guilds?.set(guild.data.id, guild)
    return [guild]
}