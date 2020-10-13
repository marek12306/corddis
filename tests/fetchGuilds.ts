import { Client } from "../src/index.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    var me = await client.me()
    me.guilds().then(value => console.log(value))
})()