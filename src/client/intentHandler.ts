import { Message } from "./../structures/message.ts"
import { Client } from "./client.ts"
import { EntityType } from "./../types/utils.ts"
import { Channel } from "../structures/channel.ts"
import { Guild } from "../structures/guild.ts"

type IntentObjectsType = { [index: string]: any }

const IntentObjects: IntentObjectsType = {
    "MESSAGE_CREATE": Message
}

const IntentHandler = async (client: Client, data: any): Promise<any> => {
    if (data.t == "MESSAGE_CREATE" || data.t == "MESSAGE_UPDATE") {
        const { guild_id, channel_id, id } = data.d
        const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, channel_id as string) as Channel;
        const object = new Message(data.d, client, channel, guild)
        client.cache.set(id, object)
        return object
    } else if (data.t == "MESSAGE_DELETE") {
        const { guild_id, channel_id, id } = data.d
        const guild = await client.get(EntityType.GUILD, data.d.guild_id as string) as Guild;
        const channel = await guild.get(EntityType.CHANNEL, data.d.channel_id as string) as Channel;
        if (client.cache.has(id)) {
            return client.cache.get(id) as Message
        } else {
            return new Message(data.d, client, channel, guild)
        }
    }
}

export { IntentHandler }