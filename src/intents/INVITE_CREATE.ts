import { Client } from "../client/client.ts"

export default async (client: Client, data: any): Promise<any> => await client.fetchInvite( data.d.code)