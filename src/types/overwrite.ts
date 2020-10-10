import { Snowflake } from './utils'

export interface OverwriteType {
    id: Snowflake;
    type: number;
    allow: string;
    deny: string;
}