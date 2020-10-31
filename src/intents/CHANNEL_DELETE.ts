import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    if (guild_id) {
        let guild
        if (client.cache.has(guild_id)) {
            guild = client.cache.get(guild_id) as Guild
        } else {
            guild = await client.get(EntityType.GUILD, guild_id) as Guild
        }
        await guild.channels()
        return [new Channel(data.d, client, guild)]
    } else {
        return [new Channel(data.d, client)]
    }
}