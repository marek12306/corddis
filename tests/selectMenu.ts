import { Client, to, ActionRowComponent, ComponentType, SelectMenuComponent, SelectMenuOptionsType, Intents, InteractionResponseEnum } from "../mod.ts";
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
      components: [{
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.SelectMenu,
            custom_id: "CUSTOM_ID", options: [{
              label: "Coffe",
              value: "Coffe"
            }, {
              label: "Tea",
              value: "Tea"
            }] as SelectMenuOptionsType[]
          } as SelectMenuComponent
        ]
      } as ActionRowComponent]
    })
  })

  client.events.$attach(to("INTERACTION_CREATE"), interaction => {

    if ((interaction.data.data as any).custom_id == "CUSTOM_ID") {
      interaction.sendResponse({
        type: InteractionResponseEnum.ChannelMessageWithSource, data: {
          content: `So you like ${(interaction.data.data as any).values[0]}`
        }
      })
    }
  })
  client.events.$attach(to("DEBUG"), console.log)

  await client.login()
})()