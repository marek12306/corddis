import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { Guild } from "../structures/guild.ts"
import { User } from "../structures/user.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, user } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(user, client)
    return [userObj, guild]
}