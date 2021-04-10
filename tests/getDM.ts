import { Client, to } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.events.$attachOnce(to("READY"), async () => {
        var me = await client.me()
        me.getDM().then(console.log)
    })
    await client.login()
})()