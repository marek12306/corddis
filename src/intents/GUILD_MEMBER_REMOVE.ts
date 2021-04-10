import { Client } from "../client/client.ts"
import { User } from "../structures/user.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.guilds.get(guild_id)
    const userObj = new User(data.d.user, client)

    if (guild.members.size > 0) {
        if (!guild.members.has(userObj.data.id)) return {member: userObj, guild}
        guild.members.delete(userObj.data.id)
        client.guilds.set(guild_id, guild)
    }

    return {member: userObj, guild}
}