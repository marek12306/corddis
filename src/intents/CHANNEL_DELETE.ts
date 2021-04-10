import { Client } from "../client/client.ts"
import { ChannelStructures } from "../constants.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    if (guild_id) {
        const guild = await client.guilds.get(guild_id)
        await guild.channels.fetchAll()
        client.guilds.set(guild_id, guild)
        return [new ChannelStructures[data.d.type](data.d, client, guild)]
    }

    return new ChannelStructures[data.d.type](data.d, client)
}