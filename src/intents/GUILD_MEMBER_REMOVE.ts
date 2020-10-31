import { EntityType } from "../types/utils.ts"
import { Client } from "../client/client.ts"
import { Guild } from "../structures/guild.ts"
import { GuildMember } from "../structures/guildMember.ts"
import { User } from "../structures/user.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { guild_id, user } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id) as Guild
    const userObj = new User(user, client)

    if (client.cache.has(`${guild_id}mem`)) {
        const guildMembers =  client.cache.get(`${guild_id}mem`) as GuildMember[]
        const found = guildMembers.find((x: GuildMember) => x.data.user?.id == userObj.data.id)
        if (!found) return [userObj, guild]
        const index = guildMembers.indexOf(found)
        if (index != -1) guildMembers.splice(index, 1)
        client.cache.set(`${guild_id}mem`, guildMembers)
    } 
    
    return [userObj, guild]
}