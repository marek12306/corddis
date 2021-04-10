import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import { Guild } from "../structures/guild.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    let guild: Guild | undefined = undefined

    if (guild_id) {
        guild = await client.guilds.get(guild_id)
        guild?.slashCommands.set(data.d.id, data)
        client.guilds.set(guild_id, guild)
    }

    client.slashCommands.set(data.d.id, data)
    return { application: data.d, guild }
}