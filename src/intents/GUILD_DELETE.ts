import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { id } = data.d
    let guild;
    if (client.guilds.has(id)) {
        guild = client.guilds.get(id)
        client.guilds.delete(id)
    }

    return !client.guilds.has(id) ? [id] : [guild]
}
