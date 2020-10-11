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
