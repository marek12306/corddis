import { User } from "./../structures/user.ts";
import { Guild } from "./../structures/guild.ts";
import { GuildType } from "./../types/guild.ts";
import { EntityType, Snowflake } from "./../types/utils.ts";
import { Channel } from "./../structures/channel.ts";
import { ChannelType } from "./../types/channel.ts";
import constants from "./../constants.ts"
import { Me } from "./me.ts";

class Client {
    token: String;
    user: User | null = null;

    constants = constants;

    constructor(token: String = "") {
        this.token = token;
    }

    _path(suffix: string) {
        return `${this.constants.BASE_URL}/v${this.constants.VERSION}/${suffix}`;
    }

    _options(method: string, body: string = "") {
        return {
            method,
            body,
            headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": this.constants.USER_AGENT,
                "Content-Type": "application/json"
            },
        };
    }

    async login(token: String = this.token): Promise<User> {
        if (token.length == 0) throw Error("Invalid token");
        this.token = token.replace(/^(Bot|Bearer)\\s*/, "");
        let response = await fetch(
            this._path(`/users/@me`),
            this._options("GET")
        );
        this.user = new User(await response.json(), this);
        return this.user;
    }

    async get(entity: EntityType, id: Snowflake): Promise<User | Guild> {
        if (!this.user) throw Error("Not logged in");
        var response;
        switch (entity) {
            case EntityType.GUILD:
                response = await fetch(
                    this._path(`/guilds/${id}`),
                    this._options("GET"));
                let guild = await response.json();
                return new Guild(guild, this)
            case EntityType.USER:
                response = await fetch(
                    this._path(`/users/${id}`),
                    this._options("GET"));
                let user = await response.json();
                return new User(user, this);
        }
    }

    async me(): Promise<Me> {
        if (!this.user) throw Error("Not logged in");
        let response = await fetch(
            this._path(`/users/@me`),
            this._options("GET"),
        );
        let user = await response.json();
        return new Me(user, this);
    }
}

export { Client };
