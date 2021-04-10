import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const invite = await client.fetchInvite(data.d.code)
    const guild = invite.data.guild?.id ? client.guilds.get(`${invite.data.guild?.id}`) : null
    return { invite, guild }
}