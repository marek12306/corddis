export interface GuildUpdateType {
  name?: string;
  region?: string;
  verification_level?: number;
  default_message_notifications?: number;
  explict_content_filter?: number;
  afk_channel_id?: string;
  afk_timeout?: number;
  icon?: string;
  owner_id?: string;
  splash?: string;
  banner?: string;
  system_channel_id?: string;
  rules_channel_id?: string;
  public_updates_channel_id?: string;
  preferred_locale?: string;
}