import { Evt } from "../deps.ts"
import { Gateway } from "./client/gateway.ts";
import { User } from './structures/user.ts';
import { ApplicationCommandRootType } from './types/commands.ts';
import { Guild } from './structures/guild.ts';
import { Channel } from './structures/channel.ts';
import { Snowflake } from './types/utils.ts';
import { GuildMember } from './structures/guildMember.ts';
import { Role } from './structures/role.ts';
import { Interaction } from './structures/interaction.ts';
import { Invite } from "./structures/invite.ts";
import { Message } from "./structures/message.ts";
import { Emoji } from "./structures/emoji.ts";
import { TextChannel } from './structures/textChannel.ts';
import { PresenceType } from './types/user.ts';
import { Voice } from './structures/voice.ts';

export const Events = new Evt<
    ["DEBUG", string] |
    ["READY", User] |
    ["RAW", string, Gateway] |
    ["APPLICATION_COMMAND_CREATE", ApplicationCommandRootType, Guild | undefined] |
    ["APPLICATION_COMMAND_DELETE", ApplicationCommandRootType, Guild | undefined] |
    ["APPLICATION_COMMAND_UPDATE", ApplicationCommandRootType, Guild | undefined] |
    ["CHANNEL_CREATE", Channel] |
    ["CHANNEL_DELETE", Channel] |
    ["CHANNEL_PINS_UPDATE", Channel] |
    ["CHANNEL_UPDATE", Channel] |
    ["GUILD_BAN_ADD", User, Guild] |
    ["GUILD_BAN_ADD", User, Guild] |
    ["GUILD_CREATE", Guild] |
    ["GUILD_DELETE", Snowflake | Guild] |
    ["GUILD_MEMBER_ADD", GuildMember, Guild] |
    ["GUILD_MEMBER_REMOVE", User, Guild] |
    ["GUILD_MEMBER_UPDATE", GuildMember] |
    ["GUILD_MEMBERS_CHUNK", Guild] |
    ["GUILD_ROLE_CREATE", Guild] |
    ["GUILD_ROLE_CREATE", Snowflake | Role, Guild] |
    ["GUILD_ROLE_UPDATE", Guild] |
    ["INTERACTION_CREATE", Interaction] |
    ["INVITE_CREATE", Invite] |
    ["INVITE_DELETE", Invite, Guild] |
    ["MESSAGE_CREATE", Message] |
    ["MESSAGE_DELETE_BULK", Message[]] |
    ["MESSAGE_DELETE", Message] |
    ["MESSAGE_REACTION_ADD", Emoji, User, TextChannel, Message] |
    ["MESSAGE_REACTION_REMOVE_ALL", Message, TextChannel, Guild | undefined] |
    ["MESSAGE_REACTION_REMOVE", Emoji, User, TextChannel, Message] |
    ["MESSAGE_UPDATE", Message] |
    ["PRESENCE_UPDATE", Guild, PresenceType] |
    ["TYPING_START", User | GuildMember, TextChannel] |
    ["VOICE_SERVER_UPDATE", Voice] |
    ["VOICE_STATE_UPDATE", Voice]
>()