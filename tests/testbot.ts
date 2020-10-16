import { Client, Intents, Message, User } from "../src/index.ts";
import { token } from "./token.ts";

(async () => {
    let client = new Client(token, Intents.GUILD_MESSAGES)
    // to samo co:
    // let client = await new Client(token).addIntents(Intents.GUILD_MESSAGES)
    client.on('MESSAGE_CREATE', async (message: Message) => {
        //console.log(message)
        if (message.data.content == "test") {
            console.log(await message.delete())
        } else if (message.data.content == "test2") {
            console.log(await message.reply("Test"))
        } else if (message.data.content == "test3") {
            console.log(await message.react(":Neil_Patel:666343612077834254"))
        } else if (message.data.content == "test4") {
            let msg = await message.reply("a");
            msg.edit("h")
        }
    })
    //client.on("raw", console.log)
    client.on("READY", (user: User) => console.log("Logged as " + user.data.username))
    client.login()
})()
