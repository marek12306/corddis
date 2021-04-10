import { Client, Intents, Message, TextChannel, to } from "../mod.ts";
import { token } from "./token.ts";

(async () => {
    const client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES)

    client.events.$attach(to("MESSAGE_CREATE"), msg => {

        console.log(msg.data.content)

        if (msg.data.content == "ok") {
            var collector = msg.channel.createCollector((msge: Message) => msge.data.author.id == "344048874656366592", { max: 1 })

            collector.on("collect", (msgs: Message) => {
                console.log(`Message collected, id: "${msgs.data.id}"`)
            })

            collector.once("end", (msgs: Message[]) => {
                console.log(`Collected messages arr length: ${msgs.length}`)
            })
        }
    })

    client.events.$attachOnce(to("READY"), () => {
        console.log("I'M FRICKING READY BOIII")
    })

    client.events.$attach(to("DEBUG"), console.log)

    client.login(token)
})()
