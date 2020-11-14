import { GuildMemberType } from "./guild.ts";
import { Snowflake } from "./utils.ts";

export interface VoiceStateUpdateType {
    guild_id: Snowflake;
    channel_id: Snowflake;
    self_mute: boolean;
    self_deaf: boolean;
}

export interface VoiceStateType {
    guild_id?: Snowflake;
    channel_id: Snowflake|null;
    user_id: Snowflake;
    member?: GuildMemberType[];
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
}

export interface VoiceServerUpdateType {
    token: string;
    guild_id: Snowflake;
    endpoint: string;
}

export interface VoiceIdentifyType {
    server_id?: Snowflake;
    user_id?: Snowflake;
    session_id?: string;
    token?: string;
    endpoint?: string;
}

export interface VoiceReadyType {
    experiments: string[];
    ip: string;
    modes: string[];
    port: number;
    ssrc: number;
}

export interface VoiceLocalType {
    address?: string;
    port?: number;
}