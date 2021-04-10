import { Client } from "../client/client.ts"
import { Gateway } from "../client/gateway.ts"
import Intent from "./APPLICATION_COMMAND_CREATE.ts"

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => Intent(gateway, client, data)