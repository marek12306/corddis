import { Client, EntityType } from "../src/index.ts";
import { token } from "./token.ts"

new Client(token)
    .get(EntityType.USER, "344048874656366592").then(value => console.log(value))  // ZiomaleQ
