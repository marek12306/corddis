import { GuildType } from '../types/guild'
import { Client } from '../client'
import { GuildUpdateType } from '../types/guildUpdate'
import { Channel } from './channel'
import { ChannelCreateType } from '../types/channelCreate'

export class Guild {
    data : GuildType
    client : Client

    constructor(data: GuildType, client: Client) {
        this.data = data
        this.client = client
    }

    async update(data : GuildUpdateType): Promise<Guild> {
        let response = await fetch(
            this.client._path(`/guilds/${this.data.id}`), 
            this.client._options('PATCH', JSON.stringify(data))
        )
        let guild = await response.json()
        return new Guild(guild, this.client)
    }

    async delete(): Promise<boolean> {
        let resp = await fetch(
            this.client._path(`/guilds/${this.data.id}`),
            this.client._options('DELETE')
        )

        if (resp.status != 204) {
            throw new Error(`Error ${resp.status}`)
        }

        return true
    }

    async channels(): Promise<Channel[]> {
        let resp = await fetch(
            this.client._path(`/guilds/${this.data.id}/channels`),
            this.client._options('GET')
        )
        let json = await resp.json()
        return json.map(data => new Channel(data, this.client))
    }

    async createChannel(data: ChannelCreateType): Promise<Channel> {
        let resp = await fetch(
            this.client._path(`/guilds/${this.data.id}/channels`),
            this.client._options('POST', JSON.stringify(data))
        )
        let json = await resp.json()
        return new Channel(json, this.client)
    }
}