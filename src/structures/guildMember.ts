import { Client } from "../client/client.ts";
import { GuildMemberType, GuildType } from "../types/guild.ts";

export class GuildMember {
    data: GuildMemberType;
    client: Client;

    constructor(data: GuildMemberType, client: Client) {
        this.data = data;
        this.client = client;
    }
}