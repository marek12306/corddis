import { Client } from "../src/index.ts";
import { token } from "./token.ts"

new Client(token).guilds().then(value => console.log(value))
