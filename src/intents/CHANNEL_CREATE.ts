import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { ChannelStructures } from "../constants.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const channel = new ChannelStructures[data.d.type](data.d, client, guild)
    if (guild.members.length > 0) {
        if (data.t == "CHANNEL_CREATE") {
            if (!guild.channels.find((x: Channel) => x.data.id == data.d.id)) guild.channels.push(channel)
        } else {
            const found = guild.channels.find((x: Channel) => x.data.id == data.d.id)
            if (!found) {
                guild.channels.push(channel)
            } else {
                guild.channels = guild.channels.map((x: Channel) =>
                    x.data.id == data.d.id ? channel : x
                )
            }
        }
        client.cache.set(guild_id, guild)
        return [channel]
    } else {
        await guild.fetchChannels()
        return [channel]
    }
}