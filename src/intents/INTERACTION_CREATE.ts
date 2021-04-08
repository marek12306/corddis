import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import { Interaction } from "../structures/interaction.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const guild = await client.guilds.get(data.d.guild_id)
    return [new Interaction(data.d, client, guild)]
}