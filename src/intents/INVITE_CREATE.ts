import { Client } from "../client/client.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => await client.fetchInvite(data.d.code)