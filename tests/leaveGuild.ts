import { Client } from "../src/index.ts";
import token from "./token.ts"

new Client(token).leaveGuild("682660337996267542").then(value => console.log(value))
