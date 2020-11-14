import { Client } from "../../mod.ts";
import { Gateway } from "../client/gateway.ts";
import { Guild } from "../structures/guild.ts";
import { EntityType } from "../types/utils.ts";

// deno-lint-ignore no-explicit-any
export default async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    const { guild_id } = data.d
    const guild = await client.get(EntityType.GUILD, guild_id as string) as Guild;
    if (data.d.user_id == client.user?.data.id) {
        guild.voice.data = {
            ...guild.voice.data,
            user_id: data.d.user_id,
            session_id: data.d.session_id,
        }
        if (data.d.channel_id == null) {
            await guild.voice.disconnect()
        } else if (guild.voice.data.endpoint && guild.voice.data.session_id) await guild.voice.connect()
    }
}