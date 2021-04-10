import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import { Guild } from "../structures/guild.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const guild = new Guild(data.d, client)
    client.guilds.set(data.d.id, guild)
    return guild
}