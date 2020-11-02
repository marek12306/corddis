import { Client } from "../client/client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts";
import { ChannelTypeData } from "../types/channel.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { member, user_id, guild_id, channel_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
        return [new GuildMember(member, guild, client), channel]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as Channel
        const user = await client.get(EntityType.USER, user_id as string) as User
        return [user, channel]
    }
}