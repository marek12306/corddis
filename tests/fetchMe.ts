import { Client } from "../src/index.ts";
import { token } from "./token.ts"

new Client(token).me().then(value => console.log(value))
