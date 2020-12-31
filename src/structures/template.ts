import { Client } from "../../mod.ts";
import { TemplateEditType, TemplateType } from "../types/guild.ts";
import { Guild } from "./guild.ts";
import { Base } from "./base.ts";

export class Template extends Base {
    data: TemplateType;
    guild: Guild;
    propNames: string[] = [];
    // deno-lint-ignore no-explicit-any
    [propName: string]: any;

    constructor(data: TemplateType, client: Client, guild: Guild) {
        super(client);
        this.data = data;
        this.guild = guild;
        this.setBase()
    }

    protected setBase(data: TemplateType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; this.propNames.push(key)}
      }
    }

    protected updateBase(data: TemplateType = this.data): void {
      for(const entry of this.propNames) {
        // deno-lint-ignore no-explicit-any
        this[entry] = (Object.entries(data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
      }
    }

    /** Updates template with new data. */
    async update(data: TemplateType): Promise<Template> {
        this.data = await this.client._fetch<TemplateType>("PUT", `guilds/${this.guild.data.id}/templates/${this.data.code}`, JSON.stringify(data), true)
        this.updateBase()
        return this
    }
    /** Deletes a template. */
    async delete(): Promise<boolean> {
        return this.guild.deleteTemplate()
    }
    /** Edits template name and description. */
    async edit(data: TemplateEditType): Promise<Template> {
        const edited = await this.client._fetch<TemplateType>("PATCH", `guilds/${this.guild.data.id}/templates/${this.data.code}`, JSON.stringify({
            name: data.name ?? this.data.name,
            description: data.description ?? this.data.description
        }), true)
        this.data = edited
        this.updateBase()
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
