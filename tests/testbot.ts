import { Client, Intents, Message, User, EmbedBuilder, EntityType, PermissionEnum, GuildMember, Guild } from "../mod.ts";
import { NewsChannel } from "../src/structures/newsChannel.ts";
import { token } from "./token.ts";

(async () => {
    const client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES)

    // to samo co:
    // let client = await new Client(token).addIntents(Intents.GUILD_MESSAGES)
    client.on('MESSAGE_CREATE', async (message: Message) => {
        if (message.data.content == "test") {
            await message.delete()
            // console.log(await message.delete())
        } else if (message.data.content == "test2") {
            console.log(await message.guild?.roles)
        } else if (message.data.content == "test3") {
            console.log(await message.react(":Neil_Patel:666343612077834254"))
        } else if (message.data.content == "test4") {
            let msg = await message.channel.sendMessage({
                content: "a",
                embed: new EmbedBuilder().title("h")
            });
            await msg.edit({
                content: "b",
                embed: new EmbedBuilder().title("c")
            })
        } else if (message.data.content == "test5") {
            console.log(await message.channel.sendFile('./h.jpg'))
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
        } else if (message.data.content == "asdf") {
            const member = await message.guild?.get(EntityType.GUILD_MEMBER, "721964514018590802") as GuildMember
            console.log(await member.hasPermission(PermissionEnum.MANAGE_WEBHOOKS))
        } else if (message.data.content == "fdsa") {
            const invites = await message.guild?.fetchInvites()
            if (invites && invites.length > 0) client.deleteInvite(invites[0])
        } else if (message.data.content == "zz") {
            console.log(await message.guild?.createEmoji({
                name: "test420",
                roles: [],
                image: await Deno.readFile("./h.jpg"),
                file_format: "jpg"
            }))
        } else if (message.data.content == "test420") {
            // const member = await message.guild.get(EntityType.GUILD_MEMBER, message.data.author.id) as GuildMember
            // console.log(member.data)
            const guild = await client.get(EntityType.GUILD, "638408587357585417") as Guild
            console.log(guild.data)
            const channel = await guild?.get(EntityType.CHANNEL, "738845663533596852") as NewsChannel
            console.log(await channel.follow("676033234106318859"))
        }
    })
//    client.on("MESSAGE_DELETE", (message: Message) => console.log("Deleted", message))
//    client.on("raw", console.log)
    client.on("CHANNEL_DELETE", console.log)
    client.on("MESSAGE_REACTION_REMOVE", console.log)
    client.on("debug", console.log)
    client.on("READY", (user: User) => {
        console.log("Logged as " + user.data.username)
        //console.log(client.toString())
    })
    client.login()
})()
