import { Channel } from "../structures/channel.ts";
import { Guild } from "../structures/guild.ts";
import { User } from "../structures/user.ts";
import { ChannelType } from "../types/channel.ts";
import { GuildType } from "../types/guild.ts";
import { UserType } from "../types/user.ts";
import { Snowflake } from "../types/utils.ts";
import { Client } from "./client.ts";

export class Me extends User {

    constructor(data: UserType, client: Client) {
        super(data, client)
    }

    async guilds(): Promise<Guild[]> {
        if (this.client.cache.has("meg")) return this.client.cache.get("meg") as Guild[];
        const guildsJSON = await this.client._fetch<GuildType[]>("GET", `users/@me/guilds`, null, true)
        this.client.cache.set("meg", guildsJSON.map((elt: GuildType) => new Guild(elt, this.client)))
        return this.client.cache.get("meg") as Guild[];
    }

    async getDM(): Promise<Channel[]> {
        if (this.client.user?.isBot()) return [];
        if (this.client.cache.get("medm")) return this.client.cache.get("medm") as Channel[];
        const channelsJSON = await this.client._fetch<ChannelType[]>("get", `users/@me/channels`, null, true)
        this.client.cache.set("medm", channelsJSON.map((elt: ChannelType) => new Channel(elt, this.client)))
        return this.client.cache.get("medm") as Channel[];
    }

    async createDM(recipent_id: Snowflake): Promise<Channel> {
        const channel = await this.client._fetch<ChannelType>("POST", `users/@me/channels`, JSON.stringify({ recipent_id }), true)
        return new Channel(channel, this.client)
    }

    async getConnections(): Promise<any> {
        if (this.client.cache.has("conn")) return this.client.cache.get("conn")
        const connections = this.client._fetch<any>("GET", `users/@me/connections`, null, true)
        this.client.cache.set("conn", connections)
        return connections
    }
}