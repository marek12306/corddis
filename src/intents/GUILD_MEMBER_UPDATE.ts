import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const updatedMember = data.d
    delete updatedMember.guild_id
    const guild = await client.guilds.get(guild_id)

    if (guild.members.has(updatedMember.user.id)) {
        const member = await guild.members.get(updatedMember.user.id)
        member.data = { ...member.data, ...updatedMember }
        guild.members.set(updatedMember.user.id, member)
    } else guild.members.set(updatedMember.user.id, await guild.members.get(updatedMember.user.id))

    client.cache.users?.set(updatedMember.user.id, await client.users.get(updatedMember.user.id))

    return [await guild.members.get(updatedMember.user.id)]
}