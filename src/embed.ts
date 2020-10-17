import { EmbedType } from "./types/embed.ts"

export default class {
    embed: EmbedType = {}

    constructor() {}

    title(value: string) {
        this.embed.title = value
        return this
    }

    description(value: string) {
        this.embed.description = value
        return this
    }

    url(value: string) {
        this.embed.url = value
        return this
    }

    timestamp(timestamp: Date = new Date()) {
        this.embed.timestamp = timestamp.toISOString()
        return this
    }

    color(value: number) {
        this.embed.color = value
        return this
    }

    footer(text: string, icon_url?: string) {
        this.embed.footer = { text, icon_url }
        return this
    }

    image(url: string, height?: number, width?: number) {
        this.embed.image = { url, height, width }
        return this
    }

    thumbnail(url: string, height?: number, width?: number) {
        this.embed.thumbnail = { url, height, width }
        return this
    }

    author(name: string, url?: string, icon_url?: string) {
        this.embed.author = { name, url, icon_url }
        return this
    }

    field(name: string, value: string, inline: boolean = false) {
        if (!this.embed.fields) this.embed.fields = []
        this.embed.fields.push({ name, value, inline })
        return this
    }

    end() { return this.embed }
}