import { Client, EntityType } from "../mod.ts";
import { User } from "../src/structures/user.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", () => {
        client.get(EntityType.USER, "344048874656366592").then(async user => {
            console.log((user as User).avatar()) // Avatar
        })  // ZiomaleQ
    })
    await client.login()
})()