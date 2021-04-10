import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import { Guild } from "../structures/guild.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id

    let guild: Guild | undefined

    if (guild_id) {
        const guild = await client.guilds.get(guild_id)
        if (guild.slashCommands.delete(data.d.id)) {
            client.guilds.set(guild_id, guild)
        }
    }

    client.slashCommands.delete(data.d.id)
    return { application: data.d, guild }
}