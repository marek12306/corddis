import { Client } from "./../client/client.ts";
import { UserType } from "../types/user.ts";
import { MessageCreateParamsType } from "../types/message.ts";
import { Message } from "./message.ts";
import { Base } from "./base.ts";

export class User extends Base {
    data: UserType;
    [propName: string]: any;

    constructor(data: UserType, client: Client) {
        super(client)
        this.data = data;
        setBase()
    }

    protected setBase(data: GuildType = this.data): void {
      for (const [key, value] of Object.entries(data)) {
        if(this[key] === undefined) {this[key] = value; propNames.push(key)}
      }
    }

    /** Sends message to DM channel. */
    async sendMessage(data: MessageCreateParamsType): Promise<Message> {
        if (this.data.id == this.client.user?.data.id) throw Error("Cannot send message to itself.")
        const me = await this.client.me()
        const channel = await me.createDM(this.data.id)
        return channel.sendMessage(data)
    }
    /** Generates a avatar URL. */
    avatar(format = "png", size = 1024): string {
        return `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}?format=${this.data.avatar?.startsWith("a_") ? "gif" : format}&size=${size}`
    }
    /** Checks if user is a bot */
    isBot(): boolean {
        return this.data.bot || false
    }
    /** Checks if user is this bot (me). */
    isMe(): boolean {
        return this.data.id == this.client.user?.data.id
    }

    toString() {
        return `User {"data":${JSON.stringify(this.data)}}`
    }
}
