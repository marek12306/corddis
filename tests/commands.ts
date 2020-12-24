import { Client, Intents } from "../mod.ts";
import { Interaction } from "../src/structures/interaction.ts";
import { ApplicationCommandOptionEnum } from "../src/types/commands.ts";
import { token } from "./token.ts"

(async () => {
    var client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES);
    client.on("READY", async () => {
        await client.registerSlashCommand({
            name: "chuj",
            description: "tas",
            options: [],
        }, "653666564918345747")
        await client.registerSlashCommand({
            name: "time",
            description: "Show current unix time",
            options: [],
        }, "653666564918345747")
        console.log("ok")
    })

    client.on("INTERACTION_CREATE", async (interaction: Interaction) => {
        if (interaction.data.data?.name == "chuj") {
            await interaction.reply({
                content: "test",
                flags: 0,
            })
            await interaction.editResponse({
                content: "test2",
                flags: 0,
            })
            await interaction.deleteResponse()
            const msg = await interaction.sendFollowup({
                content: "test3",
                flags: 0,
            })
            await interaction.editFollowup(msg.id, {
                content: "test4",
                flags: 0,
            })
            await interaction.deleteFollowup(msg.id)
        }
        
        if (interaction.data.data?.name == "time") {
            interaction.reply({
                content: Date.now().toString(),
                flags: 0,
            })
        }
    })
    await client.login()
})()