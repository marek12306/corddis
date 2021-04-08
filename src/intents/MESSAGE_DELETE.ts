import { Message } from "../structures/message.ts"
import { Client } from "../client/client.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, id } = data.d
    if (client.cache.messages?.has(id)) return [client.cache.messages.get(id)]

    const guild = guild_id ? await client.guilds.get(guild_id) : undefined
    const channel = guild_id ? await guild?.channels.get(data.d.channel_id) as TextChannel : await (await (client.me())).createDM(data.d.channel_id)

    return [new Message(data.d, client, channel, guild)]
}