import { Client } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", async () => {
        var me = await client.me()
        me.getConnections().then(console.log)
    })
    await client.login()
})()