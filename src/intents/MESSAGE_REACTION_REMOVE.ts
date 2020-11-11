import { Client } from "../client/client.ts"
import { EntityType } from "../types/utils.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Guild } from "../structures/guild.ts"
import { Emoji } from "../structures/emoji.ts"
import { User } from "../structures/user.ts";
import { ChannelTypeData } from "../types/channel.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { emoji, message_id, channel_id, guild_id, user_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as TextChannel;
        let message = message_id
        if (client.cache.messages?.has(message_id)) message = client.cache.messages.get(message_id)
        const user = await client.get(EntityType.USER, user_id as string) as User;
        return [new Emoji(emoji, client, guild), user, channel, message]
    } else {
        let channel;
        if (client.user?.isBot()) channel = new TextChannel({ id: channel_id, type: ChannelTypeData.DM }, client)
        else channel = await (await client.me()).createDM(channel_id) as TextChannel
        const user = await client.get(EntityType.USER, user_id as string) as User
        let message = message_id
        if (client.cache.messages?.has(message_id)) message = client.cache.messages.get(message_id)
        return [new Emoji(emoji, client), user, channel, message]
    }
}