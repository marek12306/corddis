import { UserMemberType, UserType } from "./user.ts";
import { Snowflake, Timestamp } from "./utils.ts";
import { GuildMemberType } from "./guild.ts";
import { ChannelMentionType } from "./channel.ts";
import { EmbedType } from "./embed.ts";
import { EmojiType } from "./emoji.ts";

export interface MessageType {
  id: Snowflake;
  channel_id: Snowflake;
  guild_id?: Snowflake;
  author: UserType;
  member?: GuildMemberType;
  content: string;
  timestamp: Timestamp;
  edited_timestamp?: Timestamp;
  tts: boolean;
  mention_everyone: boolean;
  mentions: UserMemberType[];
  mention_roles: Snowflake[];
  mention_channels?: ChannelMentionType[];
  attachments: AttachmentType[];
  embeds: EmbedType[];
  reactions?: ReactionType[];
  nonce?: number | string;
  pinned: boolean;
  webhook_id?: Snowflake;
  type: MessageTypeData;
  activity?: MessageActivityType;
  application?: number;
  message_reference?: MessageReferenceType;
  flags?: number;
}

export interface AttachmentType {
  id: Snowflake;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
}

export interface ReactionType {
  count: number;
  me: boolean;
  emoji: EmojiType;
}

export interface MessageActivityType {
  type: MessageActivityTypeData;
  party_id?: string;
}

export interface MessageApplicationType {
  id: Snowflake;
  cover_image?: string;
  description: string;
  icon?: string;
  name: string;
}

export interface MessageReferenceType {
  message_id?: Snowflake;
  channel_id?: Snowflake;
  guild_id?: Snowflake;
}

export enum MessageTypeData {
  DEFAULT = 0,
  RECIPENT_ADD,
  RECIPENT_REMOVE,
  CALL,
  CHANNEL_NAME_CHANGE,
  CHANNEL_ICON_CHANGE,
  CHANNEL_PINNED_MESSAGE,
  GUILD_MEMBER_JOIN,
  USER_PREMIUM_GUILD_SUBSCRIPTION,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3,
  CHANNEL_FOLLOW_ADD,
  GUILD_DISCOVERY_DISQUALIFIED,
  GUILD_DISCOVERY_REQUALIFIED,
}

export enum MessageActivityTypeData {
  JOIN = 1,
  SPECTATE,
  LISTEN,
  JOIN_REQUEST = 5,
}

export enum AllowedMentionTypes {
  ROLES = "roles",
  USERS = "users",
  EVERYONE = "everyone"
}

export interface AllowedMentionsType {
  parse: AllowedMentionTypes[];
  roles: Snowflake[];
  users: Snowflake[];
}

export interface FileType {
  name: string;
  content: Blob;
}

export interface MessageCreateParamsType {
  content?: string;
  nonce?: (string | number);
  tts?: boolean;
  embed?: EmbedType;
  paylad_json?: string;
  allowed_mentions?: AllowedMentionsType[];
  file?: FileType;
}

export interface MessageEditParamsType {
  content?: string;
  embed?: EmbedType;
  flags?: number;
}