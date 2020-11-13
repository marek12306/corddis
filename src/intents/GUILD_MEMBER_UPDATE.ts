import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const updatedMember = data.d
    delete updatedMember.guild_id
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild

    if (guild.members.has(updatedMember.user.id)) {
        const member = guild.members.get(updatedMember.user.id) as GuildMember
        member.data = { ...member.data, ...updatedMember }
        guild.members.set(updatedMember.user.id, member)
    } else guild.members.set(updatedMember.user.id, await guild.get(EntityType.GUILD_MEMBER, updatedMember.user.id) as GuildMember)

    client.cache.guilds?.set(guild_id, guild)

    return [guild.members.get(updatedMember.user.id) as GuildMember]
}