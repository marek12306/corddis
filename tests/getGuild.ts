import { Client, to } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.events.$attachOnce(to("READY"), () => {
        client.guilds.get("653666564918345747").then(console.log)  // Indexed
    })
    await client.login()
})()