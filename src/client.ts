import { Guild } from './structures/guild'
import { GuildType } from './types/guild'

class Client {
    BASE_URL = 'https://discord.com/api'
    VERSION = 8
    USER_AGENT = 'Corddis (https://github.com/marek12306/corddis, v0)'

    token: String

    constructor(token: String) {
        this.token = token
    }

    _path(suffix: string) {
        return `${this.BASE_URL}/v${this.VERSION}`
    }

    _options(method: string, body: string = '') {
        return {
            method, 
            body,
            headers: {
                'Authorization': `Bot ${this.token}`,
                'User-Agent': this.USER_AGENT 
            }
        }
    }

    async guild(id: Number): Promise<Guild> {
        let response = await fetch(
            this._path(`/guilds/${id}`), 
            this._options('GET')
        )
        let guild = await response.json()
        return new Guild(guild, this)
    }

}

export { Client }