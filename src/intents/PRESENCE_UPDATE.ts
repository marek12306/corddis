import { Client } from "../client/client.ts"
import { PresenceType } from "../types/user.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    const presence = data.d as PresenceType

    const guild = await client.guilds.get(guild_id)

    //Updating cache
    const member = await guild.members.get(presence.user!.id)
    member.presence = { ...member.presence, ...presence }
    guild.members.set(data.d.user.id, member)
    client.cache.guilds?.set(guild_id, guild)

    return { guild, presence }
}