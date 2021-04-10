import { Client } from "../client/client.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guildMember = { ...data.d }
    delete guildMember.guild_id
    const guild = await client.guilds.get(guild_id)
    const guildMemberObj = new GuildMember(guildMember, guild, client)

    if (guild.members.has(guildMember.user.id)) {
        return { member: guildMemberObj, guild }
    }

    guild.members.set(guildMember.user.id, guildMemberObj)
    client.guilds.set(guild_id, guild)
    return { member: guildMemberObj, guild }
}