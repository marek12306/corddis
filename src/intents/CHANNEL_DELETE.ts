import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Guild } from "../structures/guild.ts"
import { ChannelStructures } from "../constants.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id) as Guild
        await guild.fetchChannels()
        client.cache.guilds?.set(guild_id, guild)
        return [new ChannelStructures[data.d.type](data.d, client, guild)]
    } else {
        return [new ChannelStructures[data.d.type](data.d, client)]
    }
}