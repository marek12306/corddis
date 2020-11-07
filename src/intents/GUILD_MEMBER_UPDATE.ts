import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const updatedMember = data.d
    delete updatedMember.guild_id
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild

    const foundIndex = guild.members.findIndex((x: GuildMember) => x.data.user?.id == updatedMember.user.id)
    if (foundIndex > -1)
        guild.members[foundIndex].data = { ...guild.members[foundIndex].data, ...updatedMember }
    else
        guild.members.push(await guild.get(EntityType.GUILD_MEMBER, updatedMember.user.id) as GuildMember)

    client.cache.set(guild_id, guild)

    return [foundIndex > -1 ? guild.members[foundIndex] : guild.members[guild.members.length - 1]]
}