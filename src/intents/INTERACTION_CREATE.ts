import { EntityType } from "../../mod.ts"
import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import { Interaction } from "../structures/interaction.ts"
import { Guild } from "../structures/guild.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const guild = await client.get(EntityType.GUILD, data.d.guild_id) as Guild
    return [new Interaction(data.d, client, guild)]
}