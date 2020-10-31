import { Client } from "../client/client.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { id } = data.d
    if (client.cache.has(id)) {
        const guild = client.cache.get(id)
        client.cache.remove(id)
        return [guild]
    }
    return [id]
}