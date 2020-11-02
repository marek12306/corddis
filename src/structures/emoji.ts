import { Client } from "../client/client.ts";
import { EmojiEditType, EmojiType } from "../types/emoji.ts";
import { Guild } from "./guild.ts";

export class Emoji {
    data: EmojiType;
    guild: Guild | undefined;
    client: Client;
    /**
     * Class for emoji.
     * @class
     * @param {EmojiType} data raw emoji data from Discord API
     * @param {Client} client client instance
     * @param {Guild} guild the guild from which the emoji is
     */
    constructor(data: EmojiType, client: Client, guild?: Guild, ) {
        this.data = data;
        this.guild = guild;
        this.client = client;
    }
    /**
     * Deletes a emoji.
     * @returns {Promise<boolean>} true if task was successful
     */
    async delete(): Promise<boolean> {
        if (!this.guild) throw "Guild not found in emoji"
        const response = await this.client._fetch<Response>("DELETE", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, null, false)
        return response.status == 204
    }
    /**
     * Modifies an emoji.
     * @param {EmojiEditType} data raw emoji editing data to send
     * @returns {Promise<Emoji>} edited emoji
     */
    async modify(data: EmojiEditType): Promise<Emoji> {
        if (!this.guild) throw "Guild not found in emoji"
        this.data = await this.client._fetch<EmojiType>("PATCH", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, JSON.stringify(data), true)
        return this
    }

    toString() {
        return `<${this.data.animated ? 'a' : ''}:${this.data.name}:${this.data.id}>`
    }
}