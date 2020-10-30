import { Snowflake } from "./utils.ts";

export interface EmojiType {
  name: string;
  roles: any[];
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