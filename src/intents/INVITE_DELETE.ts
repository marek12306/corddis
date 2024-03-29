import { Client } from "../client/client.ts"
import { Invite } from "../structures/invite.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { code, guild_id } = data.d
    let invite, guild;
    if (client.cache.invites?.has(code)) invite = client.cache.invites.get(code) as Invite
    if (guild_id) guild = await client.guilds.get(guild_id)
    return { invite, guild }
}