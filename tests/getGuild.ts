import { Client, EntityType } from "../src/index.ts";
import { token } from "./token.ts"

new Client(token)
    .get(EntityType.GUILD, "653666564918345747").then(value => console.log(value))  // Indexed
