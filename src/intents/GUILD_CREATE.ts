import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const guild = new Guild(data.d, client)
    client.cache.guilds?.set(data.d.id, guild)
    return [guild]
}