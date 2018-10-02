import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js'
import '@material/mwc-button'

class SettingsView extends PageViewElement {
  render () {
    return html`
      ${SharedStyles}
      <style>
        .buttonbar {
          display:flex;
          flex-direction: row;
          justify-content: space-around;
        }
        
        input {
          border-width: 1px;
          border-style: solid;
          border-color: var(--app-primary-color);
          font-size: 200%;
        }
      
        .input {
          display:flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: left;
        }  
      </style>
      
      <section class="input">
        <label>set secret:</label>
        <input type="password">
      </section>
      <section class="buttonbar">
        <mwc-button icon="arrow_back" unelevated>back</mwc-button>
        <mwc-button icon="done" raised>set secret</mwc-button>
      </section>
    `
  }
}

window.customElements.define('settings-view', SettingsView)
