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
        if (this.client.cache.other?.has("meg")) return this.client.cache.other.get("meg") as Guild[];
        const guildsJSON = await this.client._fetch<GuildType[]>("GET", `users/@me/guilds`, null, true)
        const guildsArray = guildsJSON.map((elt: GuildType) => new Guild(elt, this.client))
        this.client.cache.other?.set("meg", guildsArray)
        return guildsArray;
    }
    /**
     * Gets user DM channels
     * @return User dm channels, empty array if user is a bot.
     */
    async getDM(): Promise<TextChannel[]> {
        if (this.client.user?.isBot()) return [];
        if (this.client.cache.other?.has("medm")) return this.client.cache.other.get("medm") as TextChannel[];
        const channelsJSON = await this.client._fetch<ChannelType[]>("get", `users/@me/channels`, null, true)
        const channelsArray = channelsJSON.map((elt: ChannelType) => new TextChannel(elt, this.client))
        this.client.cache.other?.set("medm", channelsArray)
        return channelsArray;
    }
    /**
     * Creates a DM with a user
     * @return newly created dm channel
     */
    async createDM(recipient_id: Snowflake): Promise<TextChannel> {
        if (this.client.cache.other?.get(`${recipient_id}dm`)) return this.client.cache.other.get(`${recipient_id}dm`) as TextChannel
        const channel = await this.client._fetch<ChannelType>("POST", `users/@me/channels`, JSON.stringify({ recipient_id }), true)
        const channelObj = new TextChannel(channel, this.client)
        this.client.cache.other?.set(`${recipient_id}dm`, channelObj)
        return channelObj
    }
    /** Gets user connections */
    async getConnections(): Promise<ConnectionType[]> {
        if (this.client.cache.other?.has("conn")) return this.client.cache.other.get("conn") as ConnectionType[]
        const connections = await this.client._fetch<ConnectionType[]>("GET", `users/@me/connections`, null, true)
        this.client.cache.other?.set("conn", connections)
        return connections
    }
}