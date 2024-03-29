import { Client } from "../../mod.ts";
import { TemplateEditType, TemplateType } from "../types/guild.ts";
import { Guild } from "./guild.ts";

export class Template {
  #client: Client
  data: TemplateType;
  guild: Guild;

  constructor(data: TemplateType, client: Client, guild: Guild) {
    this.#client = client
    this.data = data
    this.guild = guild
  }

  /** Updates template with new data. */
  async update(data: TemplateType): Promise<Template> {
    this.data = await this.#client._fetch<TemplateType>("PUT", `guilds/${this.guild.data.id}/templates/${this.data.code}`, JSON.stringify(data), true)
    return this
  }
  /** Deletes a template. */
  async delete(): Promise<boolean> {
    return !!this.guild.deleteTemplate()
  }
  /** Edits template name and description. */
  async edit(data: TemplateEditType): Promise<Template> {
    const edited = await this.#client._fetch<TemplateType>("PATCH", `guilds/${this.guild.data.id}/templates/${this.data.code}`, JSON.stringify({
      name: data.name ?? this.data.name,
      description: data.description ?? this.data.description
    }), true)
    this.data = edited
    return this
  }
  /** Generates template URL. */
  url() {
    return `https://discord.new/${this.data.code}`
  }

  toString() {
    return `Template {"data":${JSON.stringify(this.data)}}`
  }
}
