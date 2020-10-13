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
        let response = await fetch(
            this.client._path(`/users/@me/guilds`),
            this.client._options("GET"),
        );
        let guildsJSON = await response.json();
        return guildsJSON.map((elt: GuildType) => new Guild(elt, this.client));
    }

    async getDM(): Promise<Channel[]> {
        if (this.client.user?.isBot()) return [];
        let response = await fetch(
            this.client._path(`/users/@me/channels`),
            this.client._options("GET"),
        );
        let channelsJSON = await response.json();
        return channelsJSON.map((elt: ChannelType) => new Channel(elt, this.client));
    }

    async createDM(id: Snowflake): Promise<Channel> {
        let response = await fetch(
            this.client._path(`/users/@me/channels`),
            this.client._options("POST", JSON.stringify({ recipent_id: id })),
        );
        let channel = await response.json();
        return new Channel(channel, this.client)
    }

    async getConnections(): Promise<any> {
        return await fetch(
            this.client._path(`/users/@me/connections`),
            this.client._options("GET"),
        ).then(async resp => await resp.json())
    }
}