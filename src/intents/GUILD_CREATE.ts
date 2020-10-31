import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"

export default async (client: Client, data: any): Promise<any> => {
    const guild = new Guild(data.d, client)
    client.cache.set(data.d.id, guild)
    return [guild]
}