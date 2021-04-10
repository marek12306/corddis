import { Client, to } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.events.$attachOnce(to("READY"), () => {
        client.guilds.get("682660337996267542").then(value => value.leave())
    })
    await client.login()
})()