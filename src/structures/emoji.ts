import { Client } from "../client/client.ts";
import { EmojiType } from "../types/emoji.ts";
import { Guild } from "./guild.ts";

export class Emoji {
    data: EmojiType;
    guild: Guild;
    client: Client;

    constructor(data: EmojiType, guild: Guild, client: Client) {
        this.data = data;
        this.guild = guild;
        this.client = client;
    }
}