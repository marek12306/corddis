import { EntityType, Guild } from "../../mod.ts"
import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    if (guild_id) {
        const guild = await client.get(EntityType.GUILD, guild_id) as Guild
        guild.slashCommands.set(data.d.id, data)
        client.cache.guilds?.set(guild_id, guild)
        return [data.d, guild]
    } else {
        client.slashCommands.set(data.d.id, data)
        return [data.d]
    }
}