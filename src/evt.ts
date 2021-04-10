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
    ["RAW", RawEvent] |
    ["APPLICATION_COMMAND_CREATE", ApplicationEvent] |
    ["APPLICATION_COMMAND_DELETE", ApplicationEvent] |
    ["APPLICATION_COMMAND_UPDATE", ApplicationEvent] |
    ["CHANNEL_CREATE", Channel] |
    ["CHANNEL_DELETE", Channel] |
    ["CHANNEL_PINS_UPDATE", Channel] |
    ["CHANNEL_UPDATE", Channel] |
    ["GUILD_BAN_ADD", BanEvent] |
    ["GUILD_BAN_ADD", BanEvent] |
    ["GUILD_CREATE", SnowflakeOr<Guild>] |
    ["GUILD_DELETE", SnowflakeOr<Guild>] |
    ["GUILD_MEMBER_ADD", MemberEvent] |
    ["GUILD_MEMBER_REMOVE", MemberEvent] |
    ["GUILD_MEMBER_UPDATE", MemberEvent] |
    ["GUILD_MEMBERS_CHUNK", Guild] |
    ["GUILD_ROLE_CREATE", RoleEvent] |
    ["GUILD_ROLE_CREATE", RoleEvent] |
    ["GUILD_ROLE_UPDATE", RoleEvent] |
    ["INTERACTION_CREATE", Interaction] |
    ["INVITE_CREATE", InviteEvent] |
    ["INVITE_DELETE", InviteEvent] |
    ["MESSAGE_CREATE", Message] |
    ["MESSAGE_DELETE_BULK", Message[]] |
    ["MESSAGE_DELETE", Message] |
    ["MESSAGE_REACTION_ADD", EmojiEvent] |
    ["MESSAGE_REACTION_REMOVE_ALL", EmojiEvent] |
    ["MESSAGE_REACTION_REMOVE", EmojiEvent] |
    ["MESSAGE_UPDATE", Message] |
    ["PRESENCE_UPDATE", PresenceEvent] |
    ["TYPING_START", TypingEvent] |
    ["VOICE_SERVER_UPDATE", Voice] |
    ["VOICE_STATE_UPDATE", Voice]
>()

export interface RawEvent {
    data: string
    gateway: Gateway
}

export interface ApplicationEvent {
    application: ApplicationCommandRootType
    guild: Nullable<Guild>
}

export interface BanEvent {
    user: User
    guild: Guild
}

export interface MemberEvent {
    /** User with GUILD_MEMBER_REMOVE */
    member: GuildMember | User
    guild: Guild
}

export interface RoleEvent {
    role: SnowflakeOr<Role>
    guild: Guild
}

export interface InviteEvent {
    invite: Invite
    guild: Nullable<Guild>
}

export interface EmojiEvent {
    /** Nullable with MESSAGE_REACTION_REMOVE_ALL event */
    emoji: Nullable<Emoji>
    /** Nullable with MESSAGE_REACTION_REMOVE_ALL event */
    user: Nullable<User>
    message: Message
    guild: Nullable<Guild>
    channel: TextChannel
}

export interface PresenceEvent {
    presence: PresenceType
    guild: Guild
}

export interface TypingEvent {
    /** User when typing starts in a DM channel */
    user: GuildMember | User
    channel: TextChannel
}

export type SnowflakeOr<T> = Snowflake | T
export type Nullable<T> = null | T