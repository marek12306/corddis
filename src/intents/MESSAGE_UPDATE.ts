import { Client } from "../client/client.ts"
import Intent from "./MESSAGE_CREATE.ts"

export default async (client: Client, data: any): Promise<any> => Intent(client, data)