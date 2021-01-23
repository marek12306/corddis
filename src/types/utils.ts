import { Cache } from "../cache.ts";
import { User } from "../../mod.ts";

export type Snowflake = string;
export type Timestamp = string;

export enum EntityType {
    GUILD, USER, CHANNEL, BAN, ROLE, GUILD_MEMBER
}

// deno-lint-ignore no-explicit-any
export type DictionaryType = { [index: string]: any }
// deno-lint-ignore no-explicit-any
export type NumberDictionaryType = { [index: number]: any }

export interface SessionStartLimitType {
    total: number;
    remaining: number;
    reset_after: number;
}

export interface GetGatewayType {
    url: string;
    shards: number;
    session_start_limit: SessionStartLimitType;
}

export interface AccountType {
    id: string;
    name: string;
}

export interface ApplicationType {
    id: Snowflake;
    name: string;
    icon?: string;
    description: string;
    summmary: string;
    bot?: User;
}

export interface IntegrationType {
    id: Snowflake;
    name: string;
    type: string;
    enabled: boolean;
    syncing: boolean;
    role_id: Snowflake;
    enable_emoticons?: boolean;
    expire_behavior: number;
    expire_grace_period: number;
    user?: User;
    account: AccountType;
    synced_at: Timestamp;
    subscriber_count: number;
    revoked: boolean;
    application?: ApplicationType;
}

export interface ConnectionType {
    id: string;
    name: string;
    type: string;
    revoked?: boolean;
    integrations?: IntegrationType[];
    verified: boolean;
    friend_sync: boolean;
    show_activity: boolean;
    visibility: number;
}

export interface ErrorType {
    message: string;
    code: number;
}

export interface CacheType {
    guilds?: Cache;
    messages?: Cache;
    users?: Cache;
    invites?: Cache;
    other?: Cache;
}

export enum CacheEnum {
    GUILDS, MESSAGES, USERS, INVITES, OTHER
}
