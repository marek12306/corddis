import { Client, to } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token);
    client.events.$attachOnce(to("READY"), async () => {
        var me = await client.me()
        me.createDM("344048874656366592").then(console.log) // ZiomaleQ
    })
    await client.login()
})()