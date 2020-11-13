import { Webhook } from "../mod.ts";
import { url } from "./token.ts";

(async () => {
    var ws = new Webhook({ url });
    await ws.init()
    console.log(ws.toString())
    console.log(await ws.send({ content: "Elomszka" }))
})()