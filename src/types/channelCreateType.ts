import { OverwriteType } from "./overwrite";
import { Snowflake } from "./utils";

export interface ChannelCreateType {
    name: string
    type?: number
    topic?: string
    bitrate?: number
    user_limit?: number
    rate_limit_per_user?: number
    position?: number
    permission_overwrites?: OverwriteType[]
    parent_id?: Snowflake
    nsfw?: boolean
}