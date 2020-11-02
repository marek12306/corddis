import { Client } from "../client/client.ts"
import Intent from "./MESSAGE_CREATE.ts"

// deno-lint-ignore no-explicit-any
export default async (client: Client, data: any): Promise<any> => Intent(client, data)