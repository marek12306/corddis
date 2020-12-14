import { Client, EntityType } from "../mod.ts";
import { Guild } from "../src/structures/guild.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    client.once("READY", () => {
        client.get(EntityType.GUILD, "682660337996267542").then(value => (value as Guild).leave())
    })
    await client.login()
})()