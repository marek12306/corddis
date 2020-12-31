import { Client } from "../client/client.ts";
import { InviteType } from "../types/guild.ts";
import { Guild } from "./guild.ts";
import { Base } from "./base.ts";

export class Invite extends Base {
    data: InviteType;
    guild: Guild | undefined;
    [propName: string]: any;

    constructor(data: InviteType, client: Client, guild?: Guild) {
        super(client)
        this.data = data;
        this.guild = guild;
        this.setBase();
    }

    protected setBase(data: GuildType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; propNames.push(key)}
      }
    }

    /**
     * Deletes a invite.
     * @return deleted invite
     */
    async delete(): Promise<Invite> {
        const response = await this.client._fetch<Response>("DELETE", `invites/${this.data.code}`, null, false)
        this.client.cache.invites?.remove(this.data.code)
        return this
    }

    toString() {
        return `Invite {"data":${JSON.stringify(this.data)}}`
    }
}
