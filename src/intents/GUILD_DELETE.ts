import { Client } from "../client/client.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => {
    const { id } = data.d
    if (!client.cache.has(id)) return [id]
    else {
        const guild = client.cache.get(id)
        client.cache.remove(id)
        return [guild]
    }
}