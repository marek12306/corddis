import { Client, Intents } from "../mod.ts";
import { Interaction } from "../src/structures/interaction.ts";
import { ApplicationCommandOptionEnum, InteractionResponseEnum } from "../src/types/commands.ts";
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
        if (interaction.data.data?.name == "chujj") {
            await interaction.sendResponse({
                type: InteractionResponseEnum.DeferredChannelMessageWithSource,
            })
            setTimeout(() => interaction.sendFollowup({
                flags: 0,
                content: "penis",
            }), 2000)
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