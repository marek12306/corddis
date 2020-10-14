import { Client } from "../src/index.ts";
import { token } from "./token.ts";

(async () => {
    let client = await new Client(token)
    client.on('raw', console.log)
    client.login()
    console.log("Logged")
})()
