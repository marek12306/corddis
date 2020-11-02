import { EmbedType } from "./types/embed.ts"

export default class {
    embed: EmbedType = {}
    /**
     * Creates new Embed.
     * @class
     */
    constructor() {}
    /**
     * Sets title to an embed.
     * @param {string} value title
     */
    title(value: string) {
        this.embed.title = value
        return this
    }
    /**
     * Sets description to an embed.
     * @param {string} value description
     */
    description(value: string) {
        this.embed.description = value
        return this
    }
    /**
     * Sets a URL to an embed.
     * @param {string} value URL
     */
    url(value: string) {
        this.embed.url = value
        return this
    }
    /**
     * Sets a timestamp to an embed.
     * @param {Date} [timestamp] timestamp (defaults to current date) 
     */
    timestamp(timestamp: Date = new Date()) {
        this.embed.timestamp = timestamp.toISOString()
        return this
    }
    /**
     * Sets color to an embed. Can be in decimal or string hex format
     * @param {number|string} value color to set
     */
    color(value: (number|string)) {
        if (typeof value == "string" && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)) value = parseInt(value.slice(1), 16)
        this.embed.color = value as number
        return this
    }
    /**
     * Sets footer to an embed.
     * @param {string} text footer text
     * @param {string} [icon_url] footer icon url
     */
    footer(text: string, icon_url?: string) {
        this.embed.footer = { text, icon_url }
        return this
    }
    /**
     * Sets a image to an embed.
     * @param {string} url image URL
     * @param {number} [height] image height 
     * @param {number} [width] image width 
     */
    image(url: string, height?: number, width?: number) {
        this.embed.image = { url, height, width }
        return this
    }
    /**
     * Sets a thumbnail to an embed.
     * @param {string} url thumbnail URL
     * @param {number} [height] thumbnail height
     * @param {number} [width] thumbnail width 
     */
    thumbnail(url: string, height?: number, width?: number) {
        this.embed.thumbnail = { url, height, width }
        return this
    }
    /**
     * Sets a author to an embed.
     * @param {string} name author text
     * @param {string} url url (link)
     * @param {string} icon_url icon URL
     */
    author(name: string, url?: string, icon_url?: string) {
        this.embed.author = { name, url, icon_url }
        return this
    }
    /**
     * Adds a field to an embed.
     * @param {string} name field name
     * @param {string} value field value
     * @param {boolean} [inline] true if field is inline 
     */
    field(name: string, value: string, inline = false) {
        if (!this.embed.fields) this.embed.fields = []
        this.embed.fields.push({ name, value, inline })
        return this
    }
    /**
     * Generates an embed.
     * @returns {EmbedType} generated embed
     */
    end() { return this.embed }
}