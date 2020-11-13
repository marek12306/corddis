import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { id } = data.d
    if (!client.cache.guilds?.has(id)) return [id]
    else {
        const guild = client.cache.guilds?.get(id)
        client.cache.guilds?.remove(id)
        return [guild]
    }
}