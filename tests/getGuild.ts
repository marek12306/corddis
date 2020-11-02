import { Client, EntityType } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    client.get(EntityType.GUILD, "653666564918345747").then(value => console.log(value))  // Indexed
})()