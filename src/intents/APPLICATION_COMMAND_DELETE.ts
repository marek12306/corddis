import { EntityType, Guild } from "../../mod.ts"
import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id) as Guild
        if (guild.slashCommands.has(data.d.id)) {
            guild.slashCommands.delete(data.d.id)
            client.cache.guilds?.set(guild_id, guild)
        }
    } else if (client.slashCommands.has(data.d.id)) {
        client.slashCommands.delete(data.d.id)
    }
    return [data.d]
}