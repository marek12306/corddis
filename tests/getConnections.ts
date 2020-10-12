import { Client } from "../src/index.ts";
import token from "./token.ts"

new Client(token)
    .getConnections().then(elt => console.log(elt))
