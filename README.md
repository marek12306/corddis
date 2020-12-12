# corddis 
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

Deno Discord API wrapper made mainly for learning. Still in development, expect breaking changes.

- Inspired by discord.js, but still original
- Close to the API
- Highly configurable
- Written in TypeScript

## Todo
- High priority
  - [x] Support for other types of text channels (categories, news)
  - [x] Documentation
  - [x] User presence
  - [x] Webhooks
  - [x] Standalone webhook client
  - [x] Pinned messages
  - [x] More structures
  - [x] Gateway resuming
  - [ ] Slash commands
- Low priority
  - [x] More control over the cache
  - [ ] Compression
  - [x] Templates
  - [x] Sharding (internal for now)
  - [ ] Audit logs
  - [ ] ~~Voice support~~ (halted till UDP support will be stable in Deno)

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