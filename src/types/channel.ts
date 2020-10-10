import { OverwriteType } from './overwrite'
import { UserType } from './user'

export interface ChannelType {
    id: string;
    type: number;
    guild_id?: string;
    position?: number;
    permission_overwrites?: OverwriteType[];
    name?: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: string;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: UserType[];
    icon?: string;
    owner_id?: string;
    application_id?: string;
    parent_id?: string;
    last_pin_timestamp?: string;
}