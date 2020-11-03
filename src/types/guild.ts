import { EmojiType } from "./emoji.ts";
import { RoleType } from "./role.ts";
import { UserType } from "./user.ts";
import { Snowflake, Timestamp } from "./utils.ts";

export interface GuildType {
  id: Snowflake;
  name: string;
  icon: string;
  description: null;
  splash: string;
  discovery_splash: null;
  approximate_member_count: number;
  approximate_presence_count: number;
  features: string[];
  emojis: EmojiType[];
  banner: string;
  owner_id: Snowflake;
  application_id: null;
  region: string;
  afk_channel_id: null;
  afk_timeout: number;
  system_channel_id: null;
  widget_enabled: boolean;
  widget_channel_id: Snowflake;
  verification_level: number;
  roles: RoleType[];
  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: null;
  max_members: number;
  max_video_channel_users: number;
  vanity_url_code: string;
  premium_tier: number;
  premium_subscription_count: number;
  system_channel_flags: number;
  preferred_locale: string;
  rules_channel_id: null;
  public_updates_channel_id: null;
}

export interface GuildUpdateType {
  name?: string;
  region?: string;
  verification_level?: number;
  default_message_notifications?: number;
  explict_content_filter?: number;
  afk_channel_id?: Snowflake;
  afk_timeout?: number;
  icon?: string;
  owner_id?: Snowflake;
  splash?: string;
  banner?: string;
  system_channel_id?: string;
  rules_channel_id?: string;
  public_updates_channel_id?: string;
  preferred_locale?: string;
}

export interface GuildMemberType {
  user?: UserType;
  nick: string | null;
  roles: Snowflake[];
  joined_at: Timestamp;
  premium_since?: Timestamp | null;
  deaf: boolean;
  mute: boolean;
}

export interface IconAttributesType {
  size?: number;
  format?: string;
}

export interface WelcomeScreenType {
  id: string;
  name: string;
  type: number;
}

export interface PartialGuildType {
  id: Snowflake;
  name: string;
  splash?: string;
  banner?: string;
  description: string;
  icon?: string;
  features: string[];
  verification_level: number;
  vanity_url_code?: string;
  welcome_screen?: WelcomeScreenType;
}

export interface PartialChannelType {
  id: Snowflake;
  name: string;
  type: number;
}

export interface PartialUserType {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

export interface InviteType {
  code: string;
  guild?: PartialGuildType;
  channel: PartialChannelType;
  inviter?: PartialUserType;
  target_user?: PartialUserType;
  target_user_type?: number;
  approximate_presence_count?: number;
  approximate_member_count?: number;
}