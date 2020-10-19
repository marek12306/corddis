import { Client, Intents, Message, User, EmbedBuilder } from "../src/index.ts";
import { token } from "./token.ts";

(async () => {
    const client = new Client(token, Intents.GUILD_MESSAGES)
    // to samo co:
    // let client = await new Client(token).addIntents(Intents.GUILD_MESSAGES)
    client.on('MESSAGE_CREATE', async (message: Message) => {
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
            await msg.edit({
                content: "b",
                embed: new EmbedBuilder().title("c").end()
            })
        } else if (message.data.content == "test5") {
            console.log(await message.channel.sendMessage({
                content: "h",
                file: {
                    name: "h.jpg",
                    content: new Blob([await Deno.readFile("h.jpg")])
                }
            }))
        } else if (message.data.content == "status") {
            client.setStatus({
                since: null,
                status: "dnd",
                activities: [
                    {
                        name: "Bruh",
                        type: 0
                    }
                ],
                afk: false
            })
        }
    })
    client.on("MESSAGE_DELETE", (message: Message) => console.log("Deleted", message))
    client.on("raw", console.log)
    client.on("debug", console.log)
    client.on("READY", (user: User) => console.log("Logged as " + user.data.username))
    client.login()
})()
