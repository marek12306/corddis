import { EmbedType } from "./embed.ts";
import { GuildMemberType } from "./guild.ts";
import { AllowedMentionsType } from "./message.ts";
import { Snowflake } from "./utils.ts";

export interface ApplicationCommandRootType {
    id?: Snowflake;
    application_id?: Snowflake;
    name: string;
    description: string;
    options: ApplicationCommandOptionType[];
}

export interface ApplicationCommandOptionType {
    name: string;
    description: string;
    type: number;
    default?: boolean;
    required?: boolean;
    options?: ApplicationCommandOptionType[];
    choices?: ApplicationCommandOptionChoiceType[];
}

export interface ApplicationCommandOptionChoiceType {
    name: string;
    value: string|number;
}

export enum ApplicationCommandOptionEnum {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
}

export interface InteractionGuildMemberType extends GuildMemberType {
    permissions: string;
}

export interface InteractionType {
    id: Snowflake;
    type: InteractionEnum;
    data?: ApplicationCommandInteractionDataType;
    guild_id: Snowflake;
    channel_id: Snowflake;
    member: InteractionGuildMemberType;
    token: string;
    version: number;
}

export enum InteractionEnum {
    Ping = 1,
    ApplicationCommand
}

export interface ApplicationCommandInteractionDataType {
    id: Snowflake;
    name: string;
    options: ApplicationCommandInteractionDataOptionType[];
}

export interface ApplicationCommandInteractionDataOptionType {
    name: string;
    value?: ApplicationCommandOptionType;
    options?: ApplicationCommandInteractionDataOptionType[];
}

export interface InteractionResponseType {
    type: InteractionResponseEnum;
    data?: InteractionApplicationCommandCallbackDataType;
}

export enum InteractionResponseEnum {
    Pong = 1,
    Acknowledge,
    ChannelMessage,
    ChannelMessageWithSource,
    ACKWithSource
}

export interface InteractionApplicationCommandCallbackDataType {
    tts?: boolean;
    content: string;
    embeds?: EmbedType;
    allowed_mentions?: AllowedMentionsType;
    flags: number;
}