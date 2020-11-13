import { Snowflake } from "./utils.ts";
import { User } from "../structures/user.ts";
import { EmbedType } from "./embed.ts";
import { FileType, AllowedMentionsType } from "./message.ts";

export interface WebhookType {
    id: Snowflake;
    type: number;
    guild_id?: Snowflake;
    channel_id: Snowflake;
    user?: User;
    name?: string;
    avatar?: string;
    token?: string;
    application_id: Snowflake;
}

export interface WebhookEditType {
    name?: string;
    avatar?: Uint8Array;
    channel_id?: Snowflake;
}

export interface WebhookMessageCreateType {
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    file?: FileType;
    embeds?: EmbedType[];
    allowed_mentions?: AllowedMentionsType;
}

export interface URLWebhook {
    url: string;
}

export interface IDWebhook {
    token: string;
    id: Snowflake;
}