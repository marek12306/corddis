import { Client } from "../client/client.ts";
import { InviteType } from "../types/guild.ts";
import { Guild } from "./guild.ts";

export class Invite {
    data: InviteType;
    guild: Guild | undefined;
    client: Client;

    constructor(data: InviteType, client: Client, guild?: Guild) {
        this.data = data;
        this.client = client;
        this.guild = guild;
    }

    async delete(): Promise<Invite> {
        const response = await this.client._fetch<Response>("DELETE", `invites/${this.data.code}`, null, false)
        this.client.cache.remove(this.data.code)
        return this
    }

    toString() {
        return `Invite {"data":${JSON.stringify(this.data)}}`
    }
}