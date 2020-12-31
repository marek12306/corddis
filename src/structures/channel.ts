import { Client } from "./../client/client.ts";
import { ChannelModifyType, ChannelType } from "../types/channel.ts";
import { Guild } from "./guild.ts";
import { Base } from "./base.ts"

export class Channel extends Base {
  data: ChannelType;
  guild?: Guild;
  private propNames: string[] = [];
  [propName: string]: any;

  constructor(data: ChannelType, client: Client, guild?: Guild) {
    super(client)
    this.data = data;
    this.guild = guild;
    setBase()
  }

  protected setBase(data: ChannelType = this.data): void {
    for (const [key, value] of Object.entries(data)) {
      if(this[key] === undefined) {this[key] = value; propNames.push(key)}
    }
  }

  protected updateBase(data: ChannelType = this.data): void {
    for(const entry of this.propNames) {
      this[entry] = data[entry]
    }
  }

   /** Deletes a channel. */
   async delete(): Promise<boolean> {
    const response = await this.client._fetch<Response>("DELETE", `channels/${this.data.id}`, null, false);
    this.guild?.channels.delete(this.data.id)
    return response.status == 204;
  }
  /** Modifies (edits) a channel. */
  async edit(data: ChannelModifyType): Promise<Channel> {
    this.data = await this.client._fetch<ChannelType>("PATCH", `channels/${this.data.id}`, JSON.stringify(data), true)
    updateBase()
    return this
  }

  toString() {
    return `Channel {"data":${JSON.stringify(this.data)},"guild":{"data":${JSON.stringify(this.guild?.data)}}}`
  }
}
