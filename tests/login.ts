import { Client } from "../src/index.ts";
import { token } from "./token.ts";

(async () => {
    await new Client(token).login()
    console.log("Logged")
})()
