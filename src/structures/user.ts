import { Client } from "./../client/client.ts";
import { UserType } from "../types/user.ts";
import { MessageCreateParamsType } from "../types/message.ts";
import { Message } from "./message.ts";

export class User {
    data: UserType;
    client: Client;
    [propName: string]: any;

    constructor(data: UserType, client: Client) {
        this.data = data;
        this.client = client;
        for (const [key, value] of Object.entries(data)) {
          if(this[key] === undefined) this[key] = value
          else this.client.emit("debug", `Can't override '${key}', key arleady exists, leaving previous value`)
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
