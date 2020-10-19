import { EmojiType } from "./emoji.ts";
import { GuildMemberType } from "./guild.ts";
import { Snowflake } from "./utils.ts";

export interface UserType {
  id: Snowflake;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface UserMemberType extends UserType {
  member: GuildMemberType;
}

export interface ActivityTimestampsType {
  start?: number;
  end?: number;
}

export interface ActivityEmojiType {
  name: string;
  id?: Snowflake;
  animated?: boolean;
}

export interface ActivityPartyType {
  id?: string;
  size?: number[];
}

export interface ActivityAssetsType {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

export interface ActivitySecretsType {
  join?: string;
  spectate?: string;
  match?: string;
}

export interface ActivityType {
  name: string;
  type: number;
  url?: string;
  created_at?: number;
  timestamps?: ActivityTimestampsType[];
  application_id?: Snowflake;
  details?: string;
  state?: string;
  emoji?: ActivityEmojiType;
  party?: ActivityPartyType;
  assets?: ActivityAssetsType;
  secrets?: ActivitySecretsType;
  instance?: boolean;
  flags?: number;
}

export interface StatusType {
  since: number|null;
  activities: ActivityType[]|null;
  status: string;
  afk: boolean;
}