import { Client } from "../src/index.ts";
import { token } from "./token.ts"

new Client(token)
    .createDM("344048874656366592").then(elt => console.log(elt)) // ZiomaleQ
