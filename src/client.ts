import { User } from "./structures/user.ts";
import { Guild } from "./structures/guild.ts";

class Client {
	BASE_URL = "https://discord.com/api";
	VERSION = 8;
	USER_AGENT = "Corddis (https://github.com/marek12306/corddis, v0)";

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
			},
		};
	}

	async guild(id: Number): Promise<Guild> {
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
}

export { Client };
