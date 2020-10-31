import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const channel = new Channel(data.d, client, guild)
    if (client.cache.has(`${guild_id}ch`)) {
        let channels = client.cache.get(`${guild_id}ch`) as Channel[]
        if (data.t == "CHANNEL_CREATE") {
            if (!channels.find((x: Channel) => x.data.id == data.d.id)) channels.push(channel)
        } else {
            const found = channels.find((x: Channel) => x.data.id == data.d.id)
            if (!found) {
                channels.push(channel)
            } else {
                channels = channels.map((x: Channel) =>
                    x.data.id == data.d.id ? channel : x
                )
            }
        }
        client.cache.set(`${guild_id}ch`, channels)
        return [channel]
    } else {
        await guild.channels()
        return [channel]
    }
}