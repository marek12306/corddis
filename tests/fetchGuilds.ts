import { Client } from "../mod.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", async () => {
        var me = await client.me()
        me.guilds().then(guilds => console.log(guilds.map(x => x.data.name))) //Only names
    })
    await client.login()
})()