import { Client } from "../src/index.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token)
    await client.login()
    client.getConnections().then(elt => console.log(elt))
})()