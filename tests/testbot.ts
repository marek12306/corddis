import { Client, Intents, Message, User, EmbedBuilder } from "../src/index.ts";
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
            let msg = await message.channel.sendMessage({
                content: "a",
                embed: new EmbedBuilder().title("h").end()
            });
            console.log(await msg.edit({
                content: "b",
                embed: new EmbedBuilder().title("c").end()
            }))
        } else if (message.data.content == "test5") {
            console.log(await message.channel.sendMessage({
                content: "h",
                file: {
                    name: "h.jpg",
                    content: new Blob([await Deno.readFile("h.jpg")])
                }
            }))
        }
    })
    //client.on("raw", console.log)
    client.on("READY", (user: User) => console.log("Logged as " + user.data.username))
    client.login()
})()
