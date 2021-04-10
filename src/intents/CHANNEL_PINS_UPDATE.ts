import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts";
import { TextChannel } from "../structures/textChannel.ts";
// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id } = data.d
    let channel;
    if (guild_id) {
        const guild = await client.guilds.get(guild_id)
        channel = await guild.channels.get(channel_id) as TextChannel;
        channel.pinsUpdated = new Date()
        guild.channels.set(channel_id, channel)
        client.guilds.set(guild_id, guild)
    } else channel = await (await client.me()).createDM(channel_id) as TextChannel

    return channel
}