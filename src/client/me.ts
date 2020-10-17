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
        let guildsJSON = await this.client._fetch<GuildType[]>("GET", `users/@me/guilds`, null, true)
        return guildsJSON.map((elt: GuildType) => new Guild(elt, this.client));
    }

    async getDM(): Promise<Channel[]> {
        if (this.client.user?.isBot()) return [];
        let channelsJSON = await this.client._fetch<ChannelType[]>("get", `users/@me/channels`, null, true)
        return channelsJSON.map((elt: ChannelType) => new Channel(elt, this.client));
    }

    async createDM(recipent_id: Snowflake): Promise<Channel> {
        let channel = await this.client._fetch<ChannelType>("POST", `users/@me/channels`, JSON.stringify({ recipent_id }), true)
        return new Channel(channel, this.client)
    }

    async getConnections(): Promise<any> {
        return this.client._fetch<any>("GET", `users/@me/connections`, null, true)
    }
}