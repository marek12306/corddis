import { EmojiType } from './emoji'
import { RoleType } from './role'
import { UserType } from './user'
import { Snowflake, Timestamp } from './utils'

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
    widget_channel_id: string;
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
    name?: string
    region?: string
    verification_level?: number
    default_message_notifications?: number
    explict_content_filter?: number
    afk_channel_id?: Snowflake
    afk_timeout?: number
    icon?: string
    owner_id?: Snowflake
    splash?: string
    banner?: string
    system_channel_id?: string
    rules_channel_id?: string
    public_updates_channel_id?: string
    preferred_locale?: string
}

export interface GuildMemberType {
    user?: UserType;
    nick: String | null;
    roles: Snowflake[];
    joined_at: Timestamp;
    premium_since?: Timestamp | null;
    deaf: boolean;
    mute: boolean;
}