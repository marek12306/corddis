import { Client } from "../client.ts";
import { UserType } from "../types/user.ts";

export class User {
    data: UserType;
    client: Client;

    constructor(data: UserType, client: Client) {
        this.data = data;
        this.client = client;
    }
}