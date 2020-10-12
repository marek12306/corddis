import { Client } from "../src/index.ts";
import token from "./token.ts"

new Client(token).getDM().then(elt => console.log(elt))
