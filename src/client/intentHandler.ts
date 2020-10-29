import { Message } from "./../structures/message.ts"
import { Client } from "./client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Emoji } from "../structures/emoji.ts"
import { User } from "../structures/user.ts";

const IntentHandler = async (client: Client, data: any): Promise<any> => {
    if (data.t == "MESSAGE_CREATE" || data.t == "MESSAGE_UPDATE") {
        const { guild_id, channel_id, id } = data.d
        let object;
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            object = new Message(data.d, client, channel, guild)
        } else {
            const channel = await (await client.me()).createDM(channel_id) as Channel
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
            const channel = await (await client.me()).createDM(channel_id) as Channel
            return [new Message(data.d, client, channel)]
        }
    } else if (data.t == "TYPING_START") {
        const { member, guild_id, channel_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            return [new GuildMember(member, guild, client), channel]
        } else {
            client.emit("debug", "TYPING_START in DM is not implemented")
        }
    } else if (data.t == "MESSAGE_REACTION_ADD") {
        const { emoji, member, message_id, channel_id, guild_id, user_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            let message
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            return [new Emoji(emoji, guild, client), new GuildMember(member, guild, client), channel, message]
        } else {
            client.emit("debug", "MESSAGE_REACTION_ADD in DM is not implemented")
        }
    } else if (data.t == "MESSAGE_REACTION_REMOVE") {
        const { emoji, message_id, channel_id, guild_id, user_id } = data.d
        if (guild_id) {
            const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
            const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
            let message
            if (client.cache.has(message_id)) message = client.cache.get(message_id)
            const user = await client.get(EntityType.USER, user_id as string) as User;
            return [new Emoji(emoji, guild, client), user, channel, message]
        } else {
            client.emit("debug", "MESSAGE_REACTION_ADD in DM is not implemented")
        }
    } else {
        client.emit("debug", `${data.d} not implemented`)
    }
}

export { IntentHandler }