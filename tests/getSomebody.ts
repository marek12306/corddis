import { Client, to } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.events.$attachOnce(to("READY"), () => {
        client.users.get("344048874656366592").then(async user => {
            console.log(user.avatar()) // Avatar
        })  // ZiomaleQ
    })
    await client.login()
})()