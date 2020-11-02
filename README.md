# corddis 
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Deno Discord API wrapper made mainly for learning. Still in early stages of development.

- Inspired by discord.js, but still original
- Close to the API
- Highly configurable
- Written in TypeScript

## Todo
- High priority
  - [ ] Support for channels other than text
  - [x] Documentation
  - [ ] User presence
  - [ ] Webhooks
  - [ ] Pinned messages
  - [x] More structures
- Low priority
  - [ ] More control over the cache
  - [ ] Compression
  - [ ] Templates
  - [ ] OAuth2
  - [ ] Sharding
  - [ ] Voice support

## Example
```ts
import { Client, Intents, Message, User } from "https://deno.land/x/corddis/mod.ts"

const client = new Client("token", Intents.GUILD_MESSAGES)

client.on('MESSAGE_CREATE', async (message: Message) => {
    if (message.data.content == "!ping") {
        await message.reply("Pong!")
    }
})

client.on("READY", (user: User) => {
    console.log("Logged as " + user.data.username)
})

client.login()
```