import { Client, EntityType } from "../src/index.ts";
import { Guild } from "../src/structures/guild.ts";
import { token } from "./token.ts"

new Client(token).get(EntityType.GUILD, "682660337996267542").then(value => (value as Guild).leave())
