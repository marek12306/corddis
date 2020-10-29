import { Message } from "./../structures/message.ts"
import { Client } from "./client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Emoji } from "../structures/emoji.ts"
import { User } from "../structures/user.ts";
import { ChannelTypeData } from "../types/channel.ts"

const IntentHandler = async (client: Client, data: any): Promise<any> => {
    if (data.t == "MESSAGE_CREATE" || data.t == "MESSAGE_UPDATE") {
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
    } else if (data.t == "MESSAGE_DELETE") {
        const { guild_id, channel_id, id } = data.d
        if (client.cache.has(id)) return [client.cache.get(id)]
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            return [new Message(data.d, client, channel, guild)]
        } else {
            let channel;
            if (client.user?.isBot()) {
                channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
            } else {
                channel = await (await client.me()).createDM(channel_id) as Channel
            }
            return [new Message(data.d, client, channel)]
        }
    } else if (data.t == "TYPING_START") {
        const { member, user_id, guild_id, channel_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            return [new GuildMember(member, guild, client), channel]
        } else {
            let channel;
            if (client.user?.isBot()) {
                channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
            } else {
                channel = await (await client.me()).createDM(channel_id) as Channel
            }
            const user = await client.get(EntityType.USER, user_id as string) as User
            return [user, channel]
        }
    } else if (data.t == "MESSAGE_REACTION_ADD") {
        const { emoji, member, message_id, channel_id, guild_id, user_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [new Emoji(emoji, client, guild), new GuildMember(member, guild, client), channel, message]
        } else {
            let channel;
            if (client.user?.isBot()) {
                channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
            } else {
                channel = await (await client.me()).createDM(channel_id) as Channel
            }
            const user = await client.get(EntityType.USER, user_id as string) as User
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [new Emoji(emoji, client), user, channel, message]
        }
    } else if (data.t == "MESSAGE_REACTION_REMOVE") {
        const { emoji, message_id, channel_id, guild_id, user_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            const user = await client.get(EntityType.USER, user_id as string) as User;
            return [new Emoji(emoji, client, guild), user, channel, message]
        } else {
            let channel;
            if (client.user?.isBot()) {
                channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
            } else {
                channel = await (await client.me()).createDM(channel_id) as Channel
            }
            const user = await client.get(EntityType.USER, user_id as string) as User
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [new Emoji(emoji, client), user, channel, message]
        }
    } else if (data.t == "MESSAGE_REACTION_REMOVE_ALL") {
        const { message_id, channel_id, guild_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [message, channel, guild]
        } else {
            let channel;
            if (client.user?.isBot()) {
                channel = new Channel({ id: channel_id, type: ChannelTypeData.DM }, client)
            } else {
                channel = await (await client.me()).createDM(channel_id) as Channel
            }
            let message = message_id
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [message, channel]
        }
    } else {
        client.emit("debug", `${data.t} not implemented`)
    }
}

export { IntentHandler }