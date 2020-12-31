import { Snowflake } from "../../mod.ts";
import { Client } from "../client/client.ts";
import { InteractionApplicationCommandCallbackDataType, InteractionResponseEnum, InteractionResponseType, InteractionType } from "../types/commands.ts";
import { InviteType } from "../types/guild.ts";
import { MessageType } from "../types/message.ts";
import { Guild } from "./guild.ts";
import { Base } from "./base.ts"

export class Interaction extends Base {
    data: InteractionType;
    guild: Guild;
    // deno-lint-ignore no-explicit-any
    [propName: string]: any;

    constructor(data: InteractionType, client: Client, guild: Guild) {
      super(client)
        this.data = data;
        this.guild = guild;
        this.setBase()
    }

    protected setBase(data: InteractionType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) this[key] = value
      }
    }

    /** Replies to a slash command interaction with message. */
    async reply(data: InteractionApplicationCommandCallbackDataType) {
        return this.sendResponse({
            type: InteractionResponseEnum.ChannelMessageWithSource,
            data
        })
    }
    /** Sends initial response to a slash command interaction. */
    async sendResponse(data: InteractionResponseType) {
        const resp = await this.client._fetch<Response>("POST", `interactions/${this.data.id}/${this.data.token}/callback`, JSON.stringify(data), false)
        return resp.status == 204
    }
    /** Edits initial response to a slash command interaction. */
    async editResponse(response: InteractionApplicationCommandCallbackDataType) {
        const resp = await this.client._fetch<Response>("PATCH", `webhooks/${this.client.user?.data.id}/${this.data.token}/messages/@original`, JSON.stringify(response), false)
        return resp.status == 204
    }
    /** Deletes initial response to a slash command interaction. */
    async deleteResponse() {
        const resp = await this.client._fetch<Response>("DELETE", `webhooks/${this.client.user?.data.id}/${this.data.token}/messages/@original`, null, false)
        return resp.status == 204
    }
    /** Sends initial response to a slash command interaction. */
    async sendFollowup(response: InteractionApplicationCommandCallbackDataType) {
        return this.client._fetch<MessageType>("POST", `webhooks/${this.client.user?.data.id}/${this.data.token}`, JSON.stringify(response), true)
    }
    /** Edits initial response to a slash command interaction. */
    async editFollowup(id: Snowflake, response: InteractionApplicationCommandCallbackDataType) {
        const resp = await this.client._fetch<Response>("PATCH", `webhooks/${this.client.user?.data.id}/${this.data.token}/messages/${id}`, JSON.stringify(response), false)
        return resp.status == 204
    }
    /** Edits initial response to a slash command interaction. */
    async deleteFollowup(id: Snowflake) {
        const resp = await this.client._fetch<Response>("DELETE", `webhooks/${this.client.user?.data.id}/${this.data.token}/messages/${id}`, null, false)
        return resp.status == 204
    }

    toString() {
        return `Interaction {"data":${JSON.stringify(this.data)}}`
    }
}
