import { Snowflake } from "./utils.ts";

export interface OverwriteType {
  id: Snowflake;
  type: number;
  allow: string;
  deny: string;
}
