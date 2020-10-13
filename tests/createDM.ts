import { Client } from "../src/index.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token);
    await client.login()
    client.createDM("344048874656366592").then(elt => console.log(elt)) // ZiomaleQ
})()