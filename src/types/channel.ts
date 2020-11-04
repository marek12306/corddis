import { User } from "../../mod.ts";
import { OverwriteType } from "./overwrite.ts";
import { UserType } from "./user.ts";
import { Snowflake } from "./utils.ts";

export interface ChannelType {
  id: Snowflake;
  type: ChannelTypeData;
  guild_id?: Snowflake;
  position?: number;
  permission_overwrites?: OverwriteType[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: Snowflake;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: UserType[];
  icon?: string;
  owner_id?: Snowflake;
  application_id?: Snowflake;
  parent_id?: Snowflake;
  last_pin_timestamp?: string;
}

export interface ChannelCreateType {
  name: string;
  type?: number;
  topic?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  position?: number;
  permission_overwrites?: OverwriteType[];
  parent_id?: Snowflake;
  nsfw?: boolean;
}

export interface ChannelMentionType {
  id: Snowflake;
  guild_id: Snowflake;
  type: ChannelTypeData;
  name: string;
}

export enum ChannelTypeData {
  GUILD_TEXT = 0,
  DM,
  GUILD_VOICE,
  GROUP_DM,
  GUILD_CATEGORY,
  GUILD_NEWS,
  GUILD_STORE,
}

export interface WebhookType {
  id: Snowflake;
  type: number;
  guild_id?: Snowflake;
  channel_id: Snowflake;
  user?: User;
  name?: string;
  avatar?: string;
  token?: string;
  application_id: Snowflake;
}

export interface WebhookEditType {
  name?: string;
  avatar?: Uint8Array;
  channel_id?: Snowflake;
}