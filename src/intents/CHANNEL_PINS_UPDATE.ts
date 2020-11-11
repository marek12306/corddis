import { Client } from "../client/client.ts"
import { Channel } from "../structures/channel.ts";
import { Guild } from "../structures/guild.ts"
import { TextChannel } from "../structures/textChannel.ts";
import { ChannelTypeData } from "../types/channel.ts";
import { EntityType } from "../types/utils.ts";

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as TextChannel;
        channel.pinsUpdated = new Date()
        guild.channels[guild.channels.indexOf(channel)] = channel
        client.cache.guilds?.set(guild_id, guild)
        return [channel]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new TextChannel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as TextChannel
        return [channel]
    }
}