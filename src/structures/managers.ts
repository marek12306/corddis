import { ChannelStructures, Invite, Snowflake } from "../../mod.ts";
import { SubManager } from '../cache.ts';
import { InviteType } from "../types/guild.ts";
import { GuildMemberType } from '../types/guild.ts';
import { GuildMember } from './guildMember.ts';
import { Channel } from './channel.ts';
import { ChannelType } from '../types/channel.ts';

export class GuildMemberManager extends SubManager {
    /**
     * Get GuildMember by ID, by default gets from cache, if it dosen't exist in cache, it fetches from API
     * @param force If set to true will ignore a cache data and fetch directly from API
     */
    async get(id: Snowflake, force = false): Promise<GuildMember> {
        if (!force && this.has(id)) return super.get(id) as GuildMember
        else {
            const memberData = await this.client._fetch<GuildMemberType>("GET", `guilds/${this.guild.data.id}/members/${id}`, null, true)
            const member = new GuildMember(memberData, this.guild, this.client)
            this.set(member.data.user?.id, member)
            return member
        }
    }

    /**
    * Fetches all members from guild.    
    * @param force If set to true will ignore a cache data and fetch directly from API
    * @param limit limit of members to fetch
    * @param after after which member to fetch
   */
    async fetchAll(limit = 1, after: Snowflake = "0", force = false): Promise<GuildMember[]> {
        if (!force && this.size > 0) return Array.from(this.values())
        const json = await this.client._fetch<GuildMemberType[]>("GET", `guilds/${this.guild.data.id}/members?limit=${limit}&after=${after}`, null, true)
        json.forEach((data: GuildMemberType) => { if (data.user) this.set(data.user.id, new GuildMember(data, this.guild, this.client)) })
        return Array.from(this.values())
    }
}

export class InvitesManager extends SubManager {
    /**
    * Fetches all invites from guild
    * @param force If set to true will ignore a cache data and fetch directly from API
    */
    async fetchAll(force = false): Promise<Invite[]> {
        if (force) return [...this.values()]
        const fetched = await this.client._fetch<InviteType[]>("GET", `guilds/${this.guild.data.id}/invites`, null, true)
        fetched.forEach((x: InviteType) => {
            const tempInvite = new Invite(x, this.client, this.guild)
            this.set(x.code, tempInvite)
            this.client.cache.invites.set(x.code, tempInvite)
        })
        return [...this.values()]
    }
}

export class ChannelsManager extends SubManager {
    /**
    * Fetches channel with a certain ID 
    * @param force If set to true will ignore a cache data and fetch directly from API
    */
    async get<T extends Channel>(id: Snowflake, force = false): Promise<T> {
        if (!force && this.has(id)) return super.get(id) as T
        else {
            const channelData = await this.client._fetch<ChannelType>("GET", `channels/${id}`, null, true)
            const channel = new ChannelStructures[channelData.type](channelData, this.client, this.guild)
            this.set(channel.data.id, channel)
            return channel
        }
    }

    /**
    *  Fetches all channels from a guild
    * @param force If set to true will ignore a cache data and fetch directly from API
    */
    async fetchAll(force = false) {
        if (!force && this.size > 0) return Array.from(this.values())
        const channelsJson = await this.client._fetch<ChannelType[]>("GET", `guilds/${this.guild.data.id}/channels`, null, true)
        channelsJson.forEach((channel: ChannelType) => this.set(channel.id, new ChannelStructures[channel.type](channel, this.client, this)))
        return Array.from(this.values())

    }
}
