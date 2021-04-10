import { Client } from "../client/client.ts";
import { EmojiEditType, EmojiType } from "../types/emoji.ts";
import { Guild } from "./guild.ts";

export class Emoji {
  #client: Client
  data: EmojiType
  guild?: Guild

  constructor(data: EmojiType, client: Client, guild?: Guild) {
    this.#client = client
    this.data = data;
    this.guild = guild;
  }

  /** Deletes a emoji. */
  async delete(): Promise<boolean> {
    if (!this.guild) throw "Guild not found in emoji"
    return (await this.#client._fetch<Response>("DELETE", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, null, false)).status == 204
  }
  /**
   * Modifies an emoji.
   * @return edited emoji
   */
  async modify(data: EmojiEditType): Promise<Emoji> {
    if (!this.guild) throw "Guild not found in emoji"
    this.data = await this.#client._fetch<EmojiType>("PATCH", `guilds/${this.guild.data.id}/emojis/${this.data.id}`, JSON.stringify(data), true)
    return this
  }

  toString() {
    return `<${this.data.animated ? 'a' : ''}:${this.data.name}:${this.data.id}>`
  }
}
