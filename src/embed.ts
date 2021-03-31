import { EmbedType } from "./types/embed.ts"

/** Builder for message embeds. */
export class EmbedBuilder {
    private embed: EmbedType = {}

    constructor() { }
    /** Sets title to an embed. */
    title(value: string) {
        this.embed.title = value
        return this
    }
    /** Sets description to an embed. */
    description(value: string) {
        this.embed.description = value
        return this
    }
    /** Sets a URL to an embed. */
    url(value: string) {
        this.embed.url = value
        return this
    }
    /** Sets a timestamp to an embed. */
    timestamp(timestamp: Date = new Date()) {
        this.embed.timestamp = timestamp.toISOString()
        return this
    }
    /** Sets color to an embed. Can be in decimal or string hex format */
    color(value: (number | string)) {
        if (typeof value == "string" && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)) value = parseInt(value.slice(1), 16)
        this.embed.color = value as number
        return this
    }
    /** Sets footer to an embed. */
    footer(text: string, icon_url?: string) {
        this.embed.footer = { text, icon_url }
        return this
    }
    /** Sets a image to an embed. */
    image(url: string, height?: number, width?: number) {
        this.embed.image = { url, height, width }
        return this
    }
    /** Sets a thumbnail to an embed. */
    thumbnail(url: string, height?: number, width?: number) {
        this.embed.thumbnail = { url, height, width }
        return this
    }
    /** Sets a author to an embed. */
    author(name: string, url?: string, icon_url?: string) {
        this.embed.author = { name, url, icon_url }
        return this
    }
    /** Adds a field to an embed. */
    field(name: string, value: string, inline = false) {
        if (!this.embed.fields) this.embed.fields = []
        this.embed.fields.push({ name, value, inline })
        return this
    }
    /** Generates an embed. */
    end() { return this.embed }
}