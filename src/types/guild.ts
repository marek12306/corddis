import { EmojiType } from './emoji'
import { RoleType } from './role'

export interface GuildType {
    id:                            string;
    name:                          string;
    icon:                          string;
    description:                   null;
    splash:                        string;
    discovery_splash:              null;
    approximate_member_count:      number;
    approximate_presence_count:    number;
    features:                      string[];
    emojis:                        EmojiType[];
    banner:                        string;
    owner_id:                      string;
    application_id:                null;
    region:                        string;
    afk_channel_id:                null;
    afk_timeout:                   number;
    system_channel_id:             null;
    widget_enabled:                boolean;
    widget_channel_id:             string;
    verification_level:            number;
    roles:                         RoleType[];
    default_message_notifications: number;
    mfa_level:                     number;
    explicit_content_filter:       number;
    max_presences:                 null;
    max_members:                   number;
    max_video_channel_users:       number;
    vanity_url_code:               string;
    premium_tier:                  number;
    premium_subscription_count:    number;
    system_channel_flags:          number;
    preferred_locale:              string;
    rules_channel_id:              null;
    public_updates_channel_id:     null;
}
