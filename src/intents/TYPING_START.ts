import { Client } from "../client/client.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { member, user_id, guild_id, channel_id } = data.d

    const guild = guild_id ? await client.guilds.get(guild_id) : undefined

    const channel = guild_id ? await guild?.channels.get(channel_id) as TextChannel : await (await client.me()).createDM(channel_id)

    const user = guild_id ? new GuildMember(member, guild as Guild, client) : await client.users.get(user_id)

    return [user, channel]
}