import { Client } from "../client/client.ts"
import CHANNEL_CREATE from "./CHANNEL_CREATE.ts"
import CHANNEL_DELETE from "./CHANNEL_DELETE.ts"
import CHANNEL_UPDATE from "./CHANNEL_UPDATE.ts"
import GUILD_CREATE from "./GUILD_CREATE.ts"
import GUILD_DELETE from "./GUILD_DELETE.ts"
import GUILD_ROLE_CREATE from "./GUILD_ROLE_CREATE.ts"
import GUILD_ROLE_DELETE from "./GUILD_ROLE_DELETE.ts"
import GUILD_ROLE_UPDATE from "./GUILD_ROLE_UPDATE.ts"
import MESSAGE_CREATE from "./MESSAGE_CREATE.ts"
import MESSAGE_DELETE from "./MESSAGE_DELETE.ts"
import MESSAGE_REACTION_ADD from "./MESSAGE_REACTION_ADD.ts"
import MESSAGE_REACTION_REMOVE from "./MESSAGE_REACTION_REMOVE.ts"
import MESSAGE_REACTION_REMOVE_ALL from "./MESSAGE_REACTION_REMOVE_ALL.ts"
import MESSAGE_UPDATE from "./MESSAGE_UPDATE.ts"
import TYPING_START from "./TYPING_START.ts"
import GUILD_BAN_ADD from "./GUILD_BAN_ADD.ts"
import GUILD_BAN_REMOVE from "./GUILD_BAN_REMOVE.ts"
import MESSAGE_DELETE_BULK from "./MESSAGE_DELETE_BULK.ts"
import INVITE_CREATE from "./INVITE_CREATE.ts"
import INVITE_DELETE from "./INVITE_DELETE.ts"
import GUILD_MEMBER_ADD from "./GUILD_MEMBER_ADD.ts"
import GUILD_MEMBER_REMOVE from "./GUILD_MEMBER_REMOVE.ts"
import GUILD_MEMBER_UPDATE from "./GUILD_MEMBER_UPDATE.ts"

type IntentImports = {
    // deno-lint-ignore no-explicit-any
    [index: string]: (client: Client, data: any) => Promise<any>
}

const intents: IntentImports = {
    CHANNEL_CREATE,
    CHANNEL_DELETE,
    CHANNEL_UPDATE,
    GUILD_CREATE,
    GUILD_DELETE,
    GUILD_ROLE_CREATE,
    GUILD_ROLE_DELETE,
    GUILD_ROLE_UPDATE,
    MESSAGE_CREATE,
    MESSAGE_UPDATE,
    MESSAGE_DELETE,
    MESSAGE_REACTION_ADD,
    MESSAGE_REACTION_REMOVE,
    MESSAGE_REACTION_REMOVE_ALL,
    TYPING_START,
    GUILD_BAN_ADD,
    GUILD_BAN_REMOVE,
    MESSAGE_DELETE_BULK,
    INVITE_CREATE,
    INVITE_DELETE,
    GUILD_MEMBER_ADD,
    GUILD_MEMBER_REMOVE,
    GUILD_MEMBER_UPDATE,
}

export default intents