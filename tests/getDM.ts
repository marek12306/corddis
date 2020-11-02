import { Client } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    var me = await client.me()
    me.getDM().then(elt => console.log(elt))
})()