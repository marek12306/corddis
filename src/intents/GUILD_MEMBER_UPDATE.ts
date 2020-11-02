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
    let member

    const found = guild.members.find((x: GuildMember) => x.data.user?.id == updatedMember.user.id)
    if (found) {
        guild.members = guild.members.map((x: GuildMember) => {
            if (x.data.user?.id != updatedMember.user.id) return x
            x.data = { ...x.data, ...updatedMember }
            return x
        })
    } else {
        member = await guild.get(EntityType.GUILD_MEMBER, updatedMember.user.id) as GuildMember
        guild.members.push(member)
    }
    client.cache.set(guild_id, guild)

    return [member]
}