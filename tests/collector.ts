import { Client, Intents, Message, User, EmbedBuilder, EntityType, PermissionEnum, GuildMember, Guild } from "../mod.ts";
import { NewsChannel } from "../src/structures/newsChannel.ts";
import { token } from "./token.ts";

(async () => {
    const client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES)

    client.on("MESSAGE_CREATE", (msg: Message) => {
        if (msg.content == "hell yeah") {
            var collector = msg.channel.createCollector((msg: Message) => msg.author.id == "344048874656366592", {max : 1})

            collector.once("collect", (msgs: Message[]) => {
                console.log(`Message collected, content: "${msg.content}"`)
            })

            collector.once("end", (msgs: Message[]) => {
                console.log(`Collected messages: ${msgs.length}, first message content: "${msgs[0].content}"`)
            })
        }
    })

    client.once("READY", () => {
        console.log('I"M FRICING READY BOIIIII');

    })

    client.login(token)
})()
