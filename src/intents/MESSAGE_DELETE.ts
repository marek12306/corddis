import { Message } from "../structures/message.ts"
import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Guild } from "../structures/guild.ts"
import { ChannelTypeData } from "../types/channel.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id, id } = data.d
    if (client.cache.messages?.has(id)) return [client.cache.messages.get(id)]
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as TextChannel;
        return [new Message(data.d, client, channel, guild)]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new TextChannel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as TextChannel
        return [new Message(data.d, client, channel)]
    }
}