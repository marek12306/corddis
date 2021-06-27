import { Client, Intents, Message, User, EmbedBuilder, EntityType, PermissionEnum, GuildMember, Guild, to } from "../mod.ts";
import { NewsChannel } from "../src/structures/newsChannel.ts";
import { token } from "./token.ts";

(async () => {
    const client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES)

    client.events.$attach(to('MESSAGE_CREATE'), async (message: Message) => {

        try {
            switch (message.data.content) {
                case "test":
                    return await message.delete()
                case "test1":
                    return console.log(message.guild?.roles.size)
                case "test2":
                    return console.log(await message.react("❤️"))
                case "test3":
                    return await message.channel.sendMessage({ content: "a", embed: new EmbedBuilder().title("c") }).then((msg) => {
                        msg.edit({ content: "b", embed: new EmbedBuilder().title("d") })
                    })
                case "test4":
                    return message.channel.sendFile("./h.jpg")
                case "test5":
                    return client.game("work!")
                case "test6":
                    return console.log(await (await message.guild?.members.get(client.user?.data.id ?? "") as GuildMember)
                        .hasPermission(PermissionEnum.MANAGE_WEBHOOKS))
                case "test7":
                    return console.log((await message.guild?.invites.fetchAll() ?? []).length)
                case "test8":
                    return console.log(await message.guild?.createEmoji({
                        name: "test420", roles: [],
                        image: await Deno.readFile("./h.jpg"), file_format: "jpg"
                    }))
                case "test9":
                    const guild = await client.guilds.get("638408587357585417")
                    console.log(guild.data)
                    const channel = await guild?.channels.get("738845663533596852") as NewsChannel
                    console.log(await channel.follow("676033234106318859"))
                case "testAll":
                    for (let i = 0; i <= 9; i++) {
                        await message.reply(`test${i > 0 ? i : ''}`)
                        client.sleep(500)
                    }
                    return
                case "test10":
                    const msg = await message.reply("x", true)
                    const msg1 = await message.reply("no mention", true, false)
                    return
            }
        } catch (err: any) {
            console.log((err as Error).message)
        }
    })
    client.events.$attach(to("DEBUG"), console.log)
    client.events.$attach(to("READY"), (user: User) => {
        console.log("Logged as " + user.data.username)
        //console.log(client.toString())
    })
    await client.login()
})()
