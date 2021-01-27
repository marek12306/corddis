import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts";
import { Guild } from "../structures/guild.ts"
import { TextChannel } from "../structures/textChannel.ts";
import { ChannelTypeData } from "../types/channel.ts";
import { EntityType } from "../types/utils.ts";

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id, channel_id } = data.d
    let channel;
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        channel = await guild.get(EntityType.CHANNEL, channel_id as string) as TextChannel;
        channel.pinsUpdated = new Date()
        guild.channels.set(channel_id, channel)
        client.cache.guilds?.set(guild_id, guild)
    } else {
        if (client.user?.isBot()) channel = new TextChannel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as TextChannel
    }

    return [channel]
}