import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { ChannelTypeData } from "../types/channel.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { message_id, channel_id, guild_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
        let message = message_id
        if (client.cache.has(message_id)) message = client.cache.get(message_id)
        return [message, channel, guild]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as Channel
        let message = message_id
        if (client.cache.has(message_id)) message = client.cache.get(message_id)
        return [message, channel]
    }
}