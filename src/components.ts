import { ActionRowComponent, ComponentType, ButtonComponent, ButtonStyle, PartialEmojiType, SelectMenuComponent, SelectMenuOptionsType } from './types/components.ts';
export class ActionRow {
  private data: ActionRowComponent = { type: ComponentType.ActionRow, components: [] }

  /**
   * Add component to ActionRow component
   */
  addComponent(component: Button | SelectMenu): ActionRow {
    this.data.components.push(component.end())
    return this
  }

  end(): ActionRowComponent {
    return this.data
  }
}

export class Button {
  private data: ButtonComponent = { type: ComponentType.Button, style: ButtonStyle.Primary }

  /** Set button style */
  style(style: ButtonStyle): Button {
    this.data.style = style
    return this
  }

  /** Set button label */
  label(label: string): Button {
    this.data.label = label
    return this
  }

  /** Set button emoji  */
  emoji(emoji: PartialEmojiType): Button {
    this.data.emoji = emoji
    return this
  }

  /** Set button custom_id */
  id(custom_id: string): Button {
    this.data.custom_id = custom_id
    return this
  }

  /** Set button url */
  url(url: string): Button {
    this.data.url = url
    return this
  }
  /** Set button disabled status */
  disabled(status: boolean): Button {
    this.data.disabled = status
    return this
  }

  end(): ButtonComponent {
    return this.data
  }
}

export class SelectMenu {
  private data: SelectMenuComponent = { type: ComponentType.SelectMenu, options: [], custom_id: "" }

  end(): SelectMenuComponent {
    return this.data
  }

  /** Set select menu custom_id */
  id(custom_id: string): SelectMenu {
    this.data.custom_id = custom_id
    return this
  }

  /** Add options to select menu */
  options(...options: SelectMenuOptionsType[]): SelectMenu {
    this.data.options.push(...options)
    return this
  }

  /** Set select menu placeholder */
  placeholer(placeholder: string): SelectMenu {
    this.data.placeholder = placeholder
    return this
  }

  /** Set select menu disabled status */
  disabled(status: boolean): SelectMenu {
    this.data.disabled = status
    return this
  }

  /** Set select menu max values */
  max(max: number): SelectMenu {
    this.data.max_values = max
    return this
  }

  /** Set select menu min values */
  min(min: number): SelectMenu {
    this.data.min_values = min
    return this
  }
}