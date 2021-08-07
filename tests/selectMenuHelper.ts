import { Client, to, ActionRowComponent, ComponentType, SelectMenuComponent, SelectMenuOptionsType, Intents, InteractionResponseEnum, ApplicationSelectMenuInteractionType } from "../mod.ts";
import { ActionRow, SelectMenu } from "../src/components.ts";
import { token } from "./token.ts"

(async () => {
  var client = new Client(token, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_TYPING, Intents.GUILD_MESSAGE_REACTIONS, Intents.DIRECT_MESSAGE_REACTIONS, Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_PRESENCES)
  client.events.$attachOnce(to("READY"), (user) => {
    console.log("Logged as " + user.data.username)
  })
  client.events.$attach(to("MESSAGE_CREATE"), (message) => {

    if (message.data.content != "poll") return

    message.channel.sendMessage({
      content: "Pick your warrior",
      components: [
        new ActionRow().addComponent(
          new SelectMenu()
            .options({ label: "Coffe", value: "Coffe" })
            .options({ label: "Tea", value: "Tea" })
            .id("CUSTOM_ID")
        )
      ]
    })
  })

  client.events.$attach(to("INTERACTION_CREATE"), interaction => {

    if (interaction.data.data?.custom_id == "CUSTOM_ID") {
      interaction.reply({ content: `So you like ${(interaction.data.data as ApplicationSelectMenuInteractionType).values[0]}` })
    }
  })
  client.events.$attach(to("DEBUG"), console.log)

  await client.login()
})()