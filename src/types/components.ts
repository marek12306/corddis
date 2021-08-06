export interface Component {
  type: ComponentType
}

export interface ButtonComponent extends Component {
  type: ComponentType.Button
  style: ButtonStyle
  label?: string
  emoji?: PartialEmojiType
  custom_id?: string
  url?: string
  disabled?: boolean
}

export interface ActionRowComponent extends Component {
  type: ComponentType.ActionRow
  components: Component[]
}

export interface SelectMenuComponent extends Component {
  type: ComponentType.SelectMenu
  custom_id: string
  options: SelectMenuOptionsType[]
  placeholder?: string
  min_values?: number
  max_values?: number
  disabled?: boolean
}

export enum ComponentType {
  ActionRow = 1, Button = 2, SelectMenu = 3
}
export enum ButtonStyle {
  Primary = 1,
  Secondary = 2,
  Success = 3,
  Danger = 4,
  Link = 5
}

export interface SelectMenuOptionsType {
  label: string
  value: string
  description?: string
  emoji?: PartialEmojiType
  default?: boolean
}

export interface PartialEmojiType {
  name?: string
  id?: string
  animated?: boolean
}