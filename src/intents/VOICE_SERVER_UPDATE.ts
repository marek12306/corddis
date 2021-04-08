import { Client } from "../../mod.ts";
import { Gateway } from "../client/gateway.ts";

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.guilds?.get(guild_id)!;
    guild.voice.data = {
        ...guild.voice.data,
        server_id: guild_id,
        endpoint: data.d.endpoint,
        token: data.d.token,
    }
    if (guild.voice.data.endpoint && guild.voice.data.session_id) await guild.voice.connect()
    return guild.voice
}