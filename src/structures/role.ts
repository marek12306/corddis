import { Guild } from "./guild.ts";
import { RoleEditType, RoleType } from "../types/role.ts";
import { Client } from "../client/client.ts";
import { Base } from "./base.ts";

export class Role extends Base {
    data: RoleType
    guild: Guild
    propNames: string[] = [];
    [propName: string]: any;

    constructor(data: RoleType, client: Client, guild: Guild) {
        super(client)
        this.data = data
        this.guild = guild
        this.setBase()
    }

    protected setBase(data: RoleType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; this.propNames.push(key)}
      }
    }

    protected updateBase(data: RoleType = this.data): void {
      for(const entry of this.propNames) {
        this[entry] = (Object.entries(data).find((elt: any[]) => elt[0] == entry) ?? [])[1]
      }
    }

    /** Deletes a role. */
    async delete(): Promise<boolean> {
        return this.guild.deleteRole(this.data.id)
    }
    /** Edits a role. */
    async edit(data: RoleEditType): Promise<Role> {
        this.data = (await this.guild.editRole(this.data.id, data)).data
        this.updateBase()
        return this
    }

    toString() {
        return `Role {"data":${JSON.stringify(this.data)}}`
    }
}
