import { Client } from "../client/client.ts";
import { GuildMemberType } from "../types/guild.ts";
import { Guild } from "./guild.ts";

export class GuildMember {
    data: GuildMemberType;
    guild: Guild;
    client: Client;

    constructor(data: GuildMemberType, guild: Guild, client: Client) {
        this.data = data;
        this.guild = guild;
        this.client = client;
    }

    toString() {
        return `GuildMember {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild.data)}}}`
    }
}