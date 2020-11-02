import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guildMember = { ...data.d }
    delete guildMember.guild_id
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const guildMemberObj = new GuildMember(guildMember, guild, client)

    const guildMembers: GuildMember[] = []
    if (guild.members.length > 0) {
        const found = guild.members.find((x: GuildMember) => x.data.user?.id == guildMember.user.id)
        if (found) return [guildMemberObj, guild]
    }

    guildMembers.push(guildMemberObj)
    client.cache.set(guild_id, guild)
    return [guildMemberObj, guild]
}