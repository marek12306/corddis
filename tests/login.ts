import { Client, Intents, Message } from "../src/index.ts";
import { token } from "./token.ts";

(async () => {
    let client = await new Client(token).addIntent(Intents.GUILD_MESSAGES)
    client.on('MESSAGE_CREATE', async (message: Message) => {
        if (message.data.content == "test") {
            console.log(await message.delete())
        } else if (message.data.content == "test2") {
            console.log(await message.reply("Test"))
        }
    })
    client.login()
    console.log("Logged")
})()
