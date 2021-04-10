import { Message } from "../structures/message.ts"
import { Client } from "../client/client.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id, ids } = data.d
    const messages: Message[] = []
    for (const k of ids) {
        if (client.cache.messages?.has(k)) {
            messages.push(client.cache.messages.get(k) as Message)
        } else if (guild_id) {
            const guild = await client.guilds.get(guild_id);
            const channel = await guild.channels.get(channel_id) as TextChannel;
            messages.push(new Message(data.d, client, channel, guild))
        } else {
            const channel = await (await client.me()).createDM(channel_id) as TextChannel
            messages.push(new Message(data.d, client, channel))
        }
    }
    return messages
}