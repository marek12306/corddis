import { Client } from "./../client/client.ts";
import { MessageType } from "../types/message.ts";

export class Message {
    data: MessageType;
    client: Client;

    constructor(data: MessageType, client: Client) {
        this.data = data;
        this.client = client;
    }

    async reply(content: string): Promise<Message> {
        return await this.client.sendMessage(this.data.channel_id, { content })
    }

    async delete(): Promise<boolean> {
        return await this.client.deleteMessage(this.data.channel_id, this.data.id)
    }
}
