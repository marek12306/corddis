import { Client } from "../client/client.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { id } = data.d
    if (client.cache.has(id)) return [client.cache.get(id)]
    client.cache.remove(id)
    return [id]
}