import { Client } from "../src/index.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    client.me().then(value => console.log(value))
})()