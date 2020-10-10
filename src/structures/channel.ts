import { Client } from '../client'
import { ChannelType } from '../types/channel'

export class Channel {
    data: ChannelType
    client: Client

    constructor(data: ChannelType, client: Client) {
        this.data = data
        this.client = client
    }
}