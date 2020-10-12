import { User } from "./structures/user.ts";
import { Guild } from "./structures/guild.ts";
import { GuildType } from "./types/guild.ts";
import { Snowflake } from "./types/utils.ts";
import { Channel } from "./structures/channel.ts";
import { ChannelType } from "./types/channel.ts";

class Client {
    BASE_URL = "https://discord.com/api";
    VERSION = 8;
    USER_AGENT = "Corddis (https://github.com/marek12306/corddis, v0)";
    IMAGE_SIZES = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
    IMAGE_FORMATS = ['webp', 'png', 'jpg', 'jpeg', 'gif']

    token: String;

    constructor(token: String) {
        this.token = token;
    }

    _path(suffix: string) {
        return `${this.BASE_URL}/v${this.VERSION}/${suffix}`;
    }

    _options(method: string, body: string = "") {
        return {
            method,
            body,
            headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": this.USER_AGENT,
                "Content-Type": "application/json"
            },
        };
    }

    async guild(id: Snowflake): Promise<Guild> {
        let response = await fetch(
            this._path(`/guilds/${id}`),
            this._options("GET"),
        );
        let guild = await response.json();
        return new Guild(guild, this);
    }

    async me(): Promise<User> {
        let response = await fetch(
            this._path(`/users/@me`),
            this._options("GET"),
        );
        let user = await response.json();
        return new User(user, this);
    }

    async user(id: Snowflake): Promise<User> {
        let response = await fetch(
            this._path(`/users/${id}`),
            this._options("GET"),
        );
        let user = await response.json();
        return new User(user, this);
    }

    async guilds(): Promise<Guild[]> {
        let response = await fetch(
            this._path(`/users/@me/guilds`),
            this._options("GET"),
        );
        let guildsJSON = await response.json();
        let temp: Guild[] = [];
        guildsJSON.forEach((elt: GuildType) => {
            temp.push(new Guild(elt, this))
        });

        return temp;
    }

    async leaveGuild(id: Snowflake): Promise<boolean> {
        let response = await fetch(
            this._path(`/users/@me/guilds/${id}`),
            this._options("DELETE"),
        );
        return await response.text().then(value => value == "" ? true : false)
    }

    async getDM(): Promise<Channel[]> {
        // Dla botów zawsze [] więc optymalizacja byłaby c00l
        let response = await fetch(
            this._path(`/users/@me/channels`),
            this._options("GET"),
        );
        let guildsJSON = await response.json();
        let temp: Channel[] = [];
        guildsJSON.forEach((elt: ChannelType) => {
            temp.push(new Channel(elt, this))
        });

        return temp;
    }

    async createDM(id: Snowflake): Promise<Channel> {
        let response = await fetch(
            this._path(`/users/@me/channels`),
            this._options("POST", JSON.stringify({ recipent_id: id })),
        );
        let channel = await response.json();
        return new Channel(channel, this)
    }

    async getConnections(): Promise<any> {
        let response = await fetch(
            this._path(`/users/@me/connections`),
            this._options("GET"),
        );
        let connections = await response.json();
        return connections
    }
}

export { Client };
