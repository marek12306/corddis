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
        for(const entry of member.propNames) {
            // deno-lint-ignore no-explicit-any
            member[entry] = (Object.entries(member.data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
        }
        guild.members.set(updatedMember.user.id, member)
    } else guild.members.set(updatedMember.user.id, await guild.get(EntityType.GUILD_MEMBER, updatedMember.user.id) as GuildMember)

    client.cache.users?.set(updatedMember.user.id, await client.get(EntityType.USER, updatedMember.user.id))

    return [guild.members.get(updatedMember.user.id) as GuildMember]
}