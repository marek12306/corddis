import { Client } from "../client/client.ts"
import { ChannelStructures } from "../constants.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.guilds.get(guild_id)
    const channel = new ChannelStructures[data.d.type](data.d, client, guild)
    if (guild.channels.size > 0) {
        guild.channels.set(channel.data.id, channel)
        client.guilds.set(guild_id, guild)
    } else await guild.channels.fetchAll()

    return channel
}