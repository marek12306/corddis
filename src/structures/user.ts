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

    isBot(): boolean {
        return this.data.bot || false
    }
}