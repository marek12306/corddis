import { RoleType } from "./role.ts";
import { Snowflake } from "./utils.ts";

export interface EmojiType {
  name: string;
  roles: string[];
  id: string;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

export interface EmojiEditType {
  name?: string;
  roles?: Snowflake[];
}

export interface NewEmojiType {
  name: string;
  image: Uint8Array;
  roles: Snowflake[];
  file_format: string;
}