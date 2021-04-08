import { EntityType, Guild } from "../../mod.ts"
import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    delete data.d.guild_id
    let guild: Guild | undefined = undefined

    if (guild_id) {
        guild = await client.get(EntityType.GUILD, guild_id) as Guild
        guild?.slashCommands.set(data.d.id, data)
        client.guilds.set(guild_id, guild)
    }

    client.slashCommands.set(data.d.id, data)
    return [data.d, guild]
}