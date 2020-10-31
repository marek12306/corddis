import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { EntityType } from "../types/utils.ts"
import { Invite } from "../structures/invite.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { code, guild_id } = data.d
    let invite = code
    if (client.cache.has(code)) invite = client.cache.get(code) as Invite
    let guild = guild_id
    if (guild_id) guild = await client.get(EntityType.GUILD, guild_id) as Guild
    return [invite, guild]
}