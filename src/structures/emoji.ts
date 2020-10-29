import { Client } from "../client/client.ts";
import { EmojiType } from "../types/emoji.ts";
import { Guild } from "./guild.ts";

export class Emoji {
    data: EmojiType;
    guild: Guild | undefined;
    client: Client;

    constructor(data: EmojiType, client: Client, guild?: Guild, ) {
        this.data = data;
        this.guild = guild;
        this.client = client;
    }

    toString() {
        return `<${this.data.animated ? 'a' : ''}:${this.data.name}:${this.data.id}>`
    }
}