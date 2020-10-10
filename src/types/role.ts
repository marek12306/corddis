export interface RoleType {
    id:          string;
    name:        string;
    permissions: string;
    position:    number;
    color:       number;
    hoist:       boolean;
    managed:     boolean;
    mentionable: boolean;
}
