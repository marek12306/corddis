import { Client, EntityType } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", () => {
        client.get(EntityType.GUILD, "653666564918345747").then(console.log)  // Indexed
    })
    await client.login()
})()