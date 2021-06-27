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
  components: Component[]
}

export interface ActionRowComponent extends Component {
  type: ComponentType.ActionRow
}

export enum ComponentType {
  ActionRow = 1, Button = 2
}
export enum ButtonStyle {
  Primary = 1,
  Secondary = 2,
  Success = 3,
  Danger = 4,
  Link = 5
}

export interface PartialEmojiType {
  name?: string
  id?: string
  animated?: boolean
}