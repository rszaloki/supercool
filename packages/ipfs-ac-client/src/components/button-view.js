import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js'
import '@material/mwc-button'
import '@material/mwc-switch'
import '@material/mwc-formfield'

class ButtonView extends PageViewElement {
  render () {
    return html`
${SharedStyles}
<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    background-color: var(--app-header-background-color);
    color: var(--app-header-text-color);
    border-bottom: 1px solid #eee;
    padding:1vmin;
  }
  
  .formfield {
    display:flex;
    border-radius: 20px;
    background-color: var(--app-primary-color);
    color: var(--app-primary-color-text);
    overflow:hidden;
    align-items: baseline;
    padding: 0 20px;
  }
  
  .formfield > label {
    flex: 1;
    padding: 20px 0;
  }
</style>
<div class="header"><mwc-button label="Settings" icon="settings" @click="${(e) => this._openSettings(e)}"></mwc-button></div>
<section>
  <div class="formfield">
    <label @click="${(e) => this._labelClickHandler(e)}">your AC is</label><mwc-switch id="sw"></mwc-switch>
  </div>
</section>
    `
  }

  _labelClickHandler (e) {
    this.shadowRoot.querySelector('#sw').click()
  }

  _openSettings () {
    this.redirect('/settings-view')
  }
}

window.customElements.define('button-view', ButtonView)
