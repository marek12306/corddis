import { Client, EntityType } from "../src/index.ts";
import { User } from "../src/structures/user.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    client.get(EntityType.USER, "344048874656366592").then(async value => {
        console.log(value)
        console.log(await (value as User).avatar())
    })  // ZiomaleQ
})()