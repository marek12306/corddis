import { Timestamp } from "./utils.ts";

export interface EmbedType {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: Timestamp;
  color?: number;
  footer?: EmbedFooterType;
  image?: EmbedImageType;
  thumbnail?: EmbedThumbnailType;
  video?: EmbedVideoType;
  provider?: EmbedProviderType;
  author?: EmbedAuthorType;
  fields?: EmbedFieldType[];
}

export interface EmbedFooterType {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedImageType {
  url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideoType extends EmbedImageType {
  proxy_url?: String;
}

export interface EmbedThumbnailType {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedProviderType {
  name?: string;
  url?: string;
}

export interface EmbedAuthorType {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFieldType {
  name: string;
  value: string;
  inline?: boolean;
}
