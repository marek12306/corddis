import { BaseManager } from '../cache.ts';
import { Guild } from "../structures/guild.ts";
import { GuildType } from "../types/guild.ts";
import { Snowflake } from '../types/utils.ts';
import { User } from "../structures/user.ts";
import { UserType } from '../types/user.ts';

export class GuildManager extends BaseManager {
    /**
     * Fetches a guild with a certain ID
     * @param force If set to true will ignore a cache data and fetch directly from API
     */
    async get(id: Snowflake, force = false): Promise<Guild> {
        if (!force && this.has(id)) return super.get(id) as Guild
        else {
            const guildData = await this.client._fetch<GuildType>("GET", `guilds/${id}`, null, true)
            const guild = new Guild(guildData, this.client)
            this.set(guild.data.id, guild)
            return guild
        }
    }
}

export class UserManager extends BaseManager {
    /**
     * Fetches a user with a certain ID
     * @param force If set to true will ignore a cache data and fetch directly from API
     */
    async get(id: Snowflake, force = false): Promise<User> {
        if (!force && this.has(id)) return super.get(id) as User
        else {
            const userData = await this.client._fetch<UserType>("GET", `users/${id}`, null, true)
            const user = new User(userData, this.client)
            this.set(user.data.id, user)
            return user
        }
    }
}