import { Client } from "./client.ts"
import { Gateway } from "./gateway.ts"

// deno-lint-ignore no-explicit-any
const IntentHandler = async (gateway: Gateway, client: Client, data: any): Promise<any> => {
    if (client.intentHandlers.has(data.t)) {
        return client.intentHandlers.get(data.t)?.(gateway, client, data)
    } else {
        client.emit("debug", `${data.t} not implemented`)
    }
}

export { IntentHandler }