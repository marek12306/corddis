import { Client } from "../client/client.ts";
import { WebhookEditType, WebhookType } from "../types/channel.ts";
import { WebhookMessageCreateType } from "../types/message.ts";

export class Webhook {
    data: WebhookType
    client: Client

    constructor(data: WebhookType, client: Client) {
        this.data = data
        this.client = client
    }
    /** Deletes a webhook. */
    async delete(): Promise<boolean> {
        const response = await this.client._fetch<Response>("DELETE", `webhooks/${this.data.id}`, null, false)
        return response.status == 204
    }
    /** Modifies a webhook */
    async edit(data: WebhookEditType): Promise<Webhook> {
        const webhook = await this.client._fetch<WebhookType>("PATCH", `webhooks/${this.data.id}`, JSON.stringify(data), true)
        this.data = webhook
        return this
    }
    /** Executes a webhook */
    async send(data: WebhookMessageCreateType): Promise<boolean> {
        if (!data) throw Error("Content for message is not provided")
        let body: FormData|string = JSON.stringify(data)
        if (data?.file) {
            body = new FormData()
            body.append("file", data.file.content, data.file.name)
            body.append("payload_json", JSON.stringify({ ...data, file: undefined }))
        }
        const response = await this.client._fetch<Response>("POST", `webhooks/${this.data.id}/${this.data.token}`, body, false, data?.file ? false : "application/json")
        return response.status == 204
    }

    toString() {
        return `Webhook {"data":${JSON.stringify(this.data)}}`
    }
}