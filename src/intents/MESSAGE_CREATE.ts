import { Message } from "../structures/message.ts"
import { Client } from "../client/client.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id, id } = data.d
    let object;
    if (guild_id) {
        const guild = await client.guilds.get(guild_id);
        const channel = await guild.channels.get(channel_id) as TextChannel;
        object = new Message(data.d, client, channel, guild)
    } else {
        const channel = await (await client.me()).createDM(channel_id) as TextChannel
        object = new Message(data.d, client, channel)
    }
    client.cache.messages?.set(id, object)
    return [object]
}