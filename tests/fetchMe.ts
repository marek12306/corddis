import { Client } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", () => {
        client.me().then(console.log)
    })
    await client.login()
})()