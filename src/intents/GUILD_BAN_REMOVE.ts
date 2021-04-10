import { Client } from "../client/client.ts"
import { User } from "../structures/user.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    return { user: new User(data.d.user, client), guild: await client.guilds.get(data.d.guild_id) }
}