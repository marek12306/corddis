import { Client } from "./../client/client.ts";
import { UserType } from "../types/user.ts";

export class User {
    data: UserType;
    client: Client;
    /**
     * Creates a User instance.
     * @param {UserType} data raw data from Discord API
     * @param {Client} client client instance
     */
    constructor(data: UserType, client: Client) {
        this.data = data;
        this.client = client;
    }
    /**
     * Generates a avatar URL.
     * @param {string} [format] image format (defaults to png)
     * @param {number} [size] image size (defaults to 1024)
     */
    avatar(format = "png", size = 1024): string {
        return `https://cdn.discordapp.com/avatars/${this.data.id}/${this.data.avatar}?format=${this.data.avatar?.startsWith("a_") ? "gif" : format}&size=${size}`
    }
    //Helpers
    /**
     * Checks if user is a bot
     * @returns {boolean} true if user is a bot
     */
    isBot(): boolean {
        return this.data.bot || false
    }
    /**
     * Checks if user is this bot (me).
     * @returns {boolean} true if user is this bot
     */
    isMe(): boolean {
        return this.data.id == this.client.user?.data.id
    }

    toString() {
        return `User {"data":${JSON.stringify(this.data)}}`
    }
}