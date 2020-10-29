import { Message } from "./../structures/message.ts"
import { Client } from "./client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"

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
    } else {
        client.emit("debug", `${data.d} not implemented`)
    }
}

export { IntentHandler }