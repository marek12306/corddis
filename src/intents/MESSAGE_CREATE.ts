import { Message } from "../structures/message.ts"
import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { ChannelTypeData } from "../types/channel.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id, id } = data.d
    let object;
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
        object = new Message(data.d, client, channel, guild)
    } else {
        let channel;
        if (client.user?.isBot()) {
            channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
        } else {
            channel = await (await client.me()).createDM(channel_id) as Channel
        }
        object = new Message(data.d, client, channel)
    }
    client.cache.set(id, object)
    return [object]
}