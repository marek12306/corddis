import { Constants } from "../constants.ts";
import { ErrorType, Snowflake } from "../types/utils.ts";
import { WebhookType, WebhookEditType, WebhookMessageCreateType, URLWebhook, IDWebhook } from "../types/webhook.ts";
import { Channel } from "./channel.ts";

/** Webhook Client with REST API communication. */
export class Webhook {
    data: WebhookType = {} as WebhookType
    lastReq = 0
    origin: string
    inited = false

    sleep = (t: number) => new Promise(reso => setTimeout(reso, t))

    public get token(): string {
        return `${this.data.token}`
    }

    constructor(initData: URLWebhook | IDWebhook | WebhookType) {
        if ((initData as WebhookType).channel_id != undefined) {
            this.data = initData as WebhookType;
            this.origin = `${Constants.BASE_URL}/webhooks/${(initData as WebhookType).id}/${(initData as WebhookType).token}`;
            this.inited = true;
            return;
        }
        if ((initData as IDWebhook).token != undefined) this.origin = `${Constants.BASE_URL}/webhooks/${(initData as IDWebhook).id}/${(initData as IDWebhook).token}`;
        else this.origin = (initData as URLWebhook).url;
    }

    async _init() {
        var temp = (await (await fetch(this.origin)).json()) as WebhookType
        this.data = temp as WebhookType
        this.inited = true
    }

    // deno-lint-ignore no-explicit-any
    async _fetch<T>(method: string, path: string, body: string | FormData | null = "", json = true, contentType: string | boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType
        var req = new Request(`${Constants.BASE_URL}/v${Constants.VERSION}/${path}`, {
            method, body, headers: {
                "Authorization": `Bot ${this.token}`,
                "User-Agent": Constants.USER_AGENT,
                ...headers,
            },
        })

        var response = await this._performReq(req)
        if (response.status == 400) throw Error((await response.json()).message)

        // deno-lint-ignore no-explicit-any
        let respJson: any
        if (json) {
            respJson = await response.json()
            if ((respJson as ErrorType).message) throw Error((respJson as ErrorType).message)
        } else if (response.status > 299 && response.status < 200) {
            throw Error(await response.text())
        }

        return json ? respJson : response;
    }

    async _performReq(req: Request): Promise<Response> {
        var resp: Response;
        if (this.lastReq == 0 || (Date.now() - this.lastReq > 250)) {
            this.lastReq = Date.now();
            resp = await fetch(req)
        } else {
            await this.sleep(Date.now() - (this.lastReq + 250))
            this.lastReq = Date.now();
            resp = await fetch(req);
        }

        if (resp.status == 429) {
            const { retry_after } = await resp.json();
            await this.sleep(retry_after);
            this.lastReq = Date.now();
            resp = await this._performReq(req)
        }

        return resp
    }

    /** Deletes a webhook. */
    async delete(): Promise<boolean> {
        if (!this.inited) await this._init()
        const response = await this._fetch<Response>("DELETE", `webhooks/${this.data.id}/${this.token}`, null, false)
        return response.status == 204
    }
    /** Modifies a webhook */
    async edit(data: WebhookEditType): Promise<Webhook> {
        if (!this.inited) await this._init()
        const webhook = await this._fetch<WebhookType>("PATCH", `webhooks/${this.data.id}/${this.token}`, JSON.stringify(data), true)
        this.data = webhook
        return this
    }
    /** Executes a webhook */
    async send(data: WebhookMessageCreateType): Promise<boolean> {
        if (!this.inited) await this._init()
        if (!data) throw Error("Content for message is not provided")
        let body: FormData | string = JSON.stringify(data)
        if (data?.file) {
            body = new FormData()
            body.append("file", data.file.content, data.file.name)
            body.append("payload_json", JSON.stringify({ ...data, file: undefined }))
        }
        const response = await this._fetch<Response>("POST", `webhooks/${this.data.id}/${this.token}`, body, false, data?.file ? false : "application/json")
        return response.status == 204
    }

    toString() {
        return `Webhook {"data":${JSON.stringify(this.data)}}`
    }
}