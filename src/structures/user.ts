import { Client } from "../client.ts";
import { UserType } from "../types/user.ts";

export class User {
    data: UserType;
    client: Client;
    me: boolean;

    constructor(data: UserType, client: Client, me: boolean = false) {
        this.data = data;
        this.client = client;
        this.me = me;
    }

    avatar(format: string = "png", size: number = 1024): String {
        return `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}?format=${this.data.avatar?.startsWith("a_") ? "gif" : format}&size=${size}`
    }

    //Helpers
    isBot(): boolean {
        return this.data.bot || false
    }

    isMe(): boolean {
        return this.data.id == this.client.user?.data.id
    }
}