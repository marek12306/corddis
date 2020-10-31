import { Client } from "../client/client.ts"

export default async (client: Client, data: any): Promise<any> => {
    const { code } = data.d
    const invite = await client.fetchInvite(code)
    return [invite]
}