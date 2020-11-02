import { Client } from "./client.ts"

// deno-lint-ignore no-explicit-any
const IntentHandler = async (client: Client, data: any): Promise<any> => {
    if (client.intentHandlers.has(data.t)) {
        return client.intentHandlers.get(data.t)?.(client, data)
    } else {
        client.emit("debug", `${data.t} not implemented`)
    }
}

export { IntentHandler }