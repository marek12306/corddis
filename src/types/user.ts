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

export interface ActivityType {
  name: string;
  type: number;
}

export interface StatusType {
  since: number|null;
  activities: ActivityType[]|null;
  status: string;
  afk: boolean;
}