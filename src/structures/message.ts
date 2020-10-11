import { Client } from "../client.ts";
import { MessageType } from "../types/message.ts";

export class Message {
    data: MessageType;
    client: Client;

    constructor(data: MessageType, client: Client) {
        this.data = data;
        this.client = client;
    }
}
