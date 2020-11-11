import { TextChannel } from "../structures/textChannel.ts";
import { Guild } from "../structures/guild.ts";
import { User } from "../structures/user.ts";
import { ChannelType } from "../types/channel.ts";
import { GuildType } from "../types/guild.ts";
import { UserType } from "../types/user.ts";
import { ConnectionType, Snowflake } from "../types/utils.ts";
import { Client } from "./client.ts";

export class Me extends User {

    constructor(data: UserType, client: Client) {
        super(data, client)
    }
    /** Gets user guilds */
    async guilds(): Promise<Guild[]> {
        if (this.client.cache.has("meg")) return this.client.cache.get("meg") as Guild[];
        const guildsJSON = await this.client._fetch<GuildType[]>("GET", `users/@me/guilds`, null, true)
        this.client.cache.set("meg", guildsJSON.map((elt: GuildType) => new Guild(elt, this.client)))
        return this.client.cache.get("meg") as Guild[];
    }
    /**
     * Gets user DM channels
     * @return User dm channels, empty array if user is a bot.
     */
    async getDM(): Promise<TextChannel[]> {
        if (this.client.user?.isBot()) return [];
        if (this.client.cache.has("medm")) return this.client.cache.get("medm") as TextChannel[];
        const channelsJSON = await this.client._fetch<ChannelType[]>("get", `users/@me/channels`, null, true)
        this.client.cache.set("medm", channelsJSON.map((elt: ChannelType) => new TextChannel(elt, this.client)))
        return this.client.cache.get("medm") as TextChannel[];
    }
    /**
     * Creates a DM with a user
     * @return newly created dm channel
     */
    async createDM(recipient_id: Snowflake): Promise<TextChannel> {
        if (this.client.cache.get(`${recipient_id}dm`)) return this.client.cache.get(`${recipient_id}dm`) as TextChannel
        const channel = await this.client._fetch<ChannelType>("POST", `users/@me/channels`, JSON.stringify({ recipient_id }), true)
        this.client.cache.set(`${recipient_id}dm`, new TextChannel(channel, this.client))
        return this.client.cache.get(`${recipient_id}dm`) as TextChannel
    }
    /** Gets user connections */
    async getConnections(): Promise<ConnectionType[]> {
        if (this.client.cache.has("conn")) return this.client.cache.get("conn") as ConnectionType[]
        const connections = await this.client._fetch<ConnectionType[]>("GET", `users/@me/connections`, null, true)
        this.client.cache.set("conn", connections)
        return connections
    }
}