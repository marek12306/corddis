import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const updatedMember = data.d
    delete updatedMember.guild_id
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    let member, guildMembers

    if (client.cache.has(`${guild_id}mem`)) {
        guildMembers = client.cache.get(`${guild_id}mem`) as GuildMember[]
        const found = guildMembers.find((x: GuildMember) => x.data.user?.id == updatedMember.user.id)
        if (!found) {
            member = await guild.member(updatedMember.user.id)
        } else {
            guildMembers = guildMembers.map((x: GuildMember) => {
                if (x.data.user?.id != updatedMember.user.id) return x
                x.data = { ...x.data, ...updatedMember }
                return x
            })
        }
    } else {
        guildMembers = []
        member = await guild.member(updatedMember.user.id)
        guildMembers.push(member)
    }
    client.cache.set(`${guild_id}mem`, guildMembers)

    return [member]
}