import {
  ControlElement,
  css,
  CSSResult,
  customElement,
  html,
  property,
  PropertyValues,
  TemplateResult
} from '@refinitiv-ui/core';

import '../icon';

/**
 * Use button for actions in forms, dialogs,
 * and more with support for different states and styles.
 * @attr {boolean} disabled - Set state to disabled
 * @prop {boolean} [disabled=false] - Set state to disabled
 */
@customElement('ef-button')
export class Button extends ControlElement {
  /**
   * A `CSSResult` that will be used
   * to style the host, slotted children
   * and the internal template of the element.
   * @return {CSSResult | CSSResult[]} CSS template
   */
  static get styles (): CSSResult | CSSResult[] {
    return css`
      :host(:not(:hover)) #hover-icon,
      :host(:hover) [part=icon]:not(#hover-icon) {
        display: none;
      }
    `;
  }

  /**
   * Customises text alignment when specified alongside `icon` property
   * Value can be `before` or `after`
   */
  @property({ type: String, reflect: true })
  public textpos: 'before' | 'after' = 'after';

  /**
   * Removes background when specified alongside `icon` property
   */
  @property({ type: Boolean, reflect: true })
  public transparent = false;

  /**
   * Specify icon to display in button. Value can be icon name
   */
  @property({ type: String, reflect: true })
  public icon: string | null = null;

  /**
   * Specify icon to display when hovering. Value can be icon name
   */
  @property({ type: String, reflect: true, attribute: 'hover-icon' })
  public hoverIcon: string | null = null;

  /**
   * Set state to call-to-action
   */
  @property({ type: Boolean, reflect: true })
  public cta = false;

  /**
   * Enable or disable ability to be toggled
   */
  @property({ type: Boolean, reflect: true })
  public toggles = false;

  /**
   * An active or inactive state, can only be used with toggles property/attribute
   */
  @property({ type: Boolean, reflect: true })
  public active = false;

  /**
   * Use by theme to detect when no content inside button
   */
  private empty = false;

  /**
   * Called once after the component is first rendered
   * @param changedProperties map of changed properties with old values
   * @returns {void}
   */
  protected firstUpdated (changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.addEventListener('tap', this.toggleActive);
    this.addEventListener('tapstart', this.setPressed);
    this.addEventListener('tapend', this.unsetPressed);
    this.addEventListener('keyup', this.onKeyUpHandler);

    this.emptyComputed();
  }

  /**
   * Handle the slotchange event of default slot
   * @returns {void}
   */
  private onDefaultSlotChangeHandler = (): void => {
    this.emptyComputed();
  };

  /**
   * Handle keydown event
   * @param event the keyboard event
   * @returns {void}
   */
  private onKeyUpHandler = (event: KeyboardEvent): void => {
    if (this.isReturnOrSpaceKey(event.key)) {
      this.click();
    }
  };

  /**
   * Check key names
   * @param key the keyboard key
   * @returns true if space or enter pressed
   */
  private isReturnOrSpaceKey (key: string): boolean {
    return key === ' '
      || key === 'Spacebar'
      || key === 'Enter'
      || key === 'Return';
  }

  /**
   * Handle active property, when toggles is true
   * @returns {void}
   */
  private toggleActive = (): void => {
    if (this.toggles) {
      this.active = !this.active;
      /**
       * Fired on changing `active` property state by taping on button when property `toggles` is true.
       * Provides new state of `active` property in detail.value field
       */
      this.dispatchEvent(new CustomEvent('active-changed', {
        detail: { value: this.active }
      }));
    }
  };

  /**
   * Set pressed attribute
   * @returns {void}
   */
  private setPressed = (): void => {
    this.setAttribute('pressed', '');
  };

  /**
   * Remove pressed attribute
   * @returns {void}
   */
  private unsetPressed = (): void => {
    this.removeAttribute('pressed');
  };

  /**
   * Compute empty property based on textContent
   * @returns {void}
   */
  private emptyComputed (): void {
    this.empty = this.textContent ? this.textContent.length === 0 : true;
    this.switchEmptyAttribute();
  }

  /**
   * Set or remove attribute "empty" based on slot present
   * @returns {void}
   */
  private switchEmptyAttribute (): void {
    if (this.empty) {
      this.setAttribute('empty', '');
    }
    else {
      this.removeAttribute('empty');
    }
  }

  /**
   * Returns icon template if exists
   * @return {TemplateResult | null}  Render template
   */
  private get iconTemplate (): TemplateResult | null {
    return this.icon
      ? html`<ef-icon part="icon" icon="${this.icon}" id="icon"></ef-icon>`
      : null;
  }

  /**
   * Returns hover icon template if exists
   * @return {TemplateResult | null}  Render template
   */
  private get hoverIconTemplate (): TemplateResult | null {
    const hoverIcon = this.hoverIcon || this.icon;
    return hoverIcon
      ? html`<ef-icon part="icon" icon="${hoverIcon}" id="hover-icon"></ef-icon>`
      : null;
  }

  /**
   * A `TemplateResult` that will be used
   * to render the updated internal template.
   * @return {TemplateResult}  Render template
   */
  protected render (): TemplateResult {
    return html`
      ${this.iconTemplate}
      ${this.hoverIconTemplate}
      <span part="label">
        <slot @slotchange="${this.onDefaultSlotChangeHandler}"></slot>
      </span>
    `;
  }
}
