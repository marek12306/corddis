import { Client } from "./client/client.ts";
import { Guild } from "./structures/guild.ts";

export default class Cache extends Map {
  private max: number = 0;

  constructor(max: number = 0) {
    super()
    this.max = max
  }

  set(key: any, value: any) {
    if (this.max != 0) {
      if (this.size >= this.max && this.size != 0) this.delete([...this.keys()][0])
    }
    super.set(key, value);
    return this;
  }
}

export class BaseManager extends Cache {
  protected client: Client

  constructor(max: number, client: Client) {
    super(max)
    this.client = client
  }
}

export class SubManager extends BaseManager {
  //For now guild only
  
  protected client: Client
  protected guild: Guild

  constructor(client: Client, guild: Guild) {
    super(0, client)
    this.client = client
    this.guild = guild
  }
}