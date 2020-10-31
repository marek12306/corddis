import { Client } from "../client/client.ts"
import Intent from "./GUILD_ROLE_CREATE.ts"

export default async (client: Client, data: any): Promise<any> => {
    return Intent(client, data)
}