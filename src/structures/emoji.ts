import { Client } from "../client/client.ts";
import { EmojiEditType, EmojiType } from "../types/emoji.ts";
import { Guild } from "./guild.ts";
import { Base } from "./base.ts"

export class Emoji extends Base {
    data: EmojiType;
    guild: Guild | undefined;
    private propNames: string[] = [];
    [propName: string]: any;

    constructor(data: EmojiType, client: Client, guild?: Guild) {
        super(client)
        this.data = data;
        this.guild = guild;
        this.setBase()
    }

    protected setBase(data: EmojiType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; propNames.push(key)}
      }
    }

    protected updateBase(data: EmojiType = this.data): void {
      for(const entry of this.propNames) {
        this[entry] = data[entry]
      }
    }

    /** Deletes a emoji. */
    async delete(): Promise<boolean> {
        if (!this.guild) throw "Guild not found in emoji"
        return (await this.client._fetch<Response>("DELETE", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, null, false)).status == 204
    }
    /**
     * Modifies an emoji.
     * @return edited emoji
     */
    async modify(data: EmojiEditType): Promise<Emoji> {
        if (!this.guild) throw "Guild not found in emoji"
        this.data = await this.client._fetch<EmojiType>("PATCH", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, JSON.stringify(data), true)
        this.updateBase()
        return this
    }

    toString() {
        return `<${this.data.animated ? 'a' : ''}:${this.data.name}:${this.data.id}>`
    }
}
