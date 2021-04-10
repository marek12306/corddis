import { Client } from "../client/client.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Emoji } from "../structures/emoji.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { emoji, member, message_id, guild_id, user_id } = data.d

    const guild = guild_id ? await client.guilds.get(guild_id) : undefined
    const channel = guild_id ? await guild?.channels.get(data.d.channel_id) as TextChannel : await (await (client.me())).createDM(data.d.channel_id)

    const user = guild_id ? new GuildMember(member, guild!, client) : await client.users.get(user_id)
    const emojiStruct = guild_id ? new Emoji(emoji, client, guild) : new Emoji(emoji, client)
    const message = client.cache.messages?.has(message_id) ? channel.fetchMessage(message_id) : client.cache.messages?.get(message_id)

    return { emoji: emojiStruct, user, channel, message, guild }
}