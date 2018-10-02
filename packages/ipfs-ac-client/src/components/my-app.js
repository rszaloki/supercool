/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html } from '@polymer/lit-element'
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js'
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js'
import { installOfflineWatcher } from 'pwa-helpers/network.js'
import { installRouter } from 'pwa-helpers/router.js'

import './snack-bar.js'
import './my-view404.js'
import './button-view.js'
import './settings-view.js'

class MyApp extends LitElement {
  render () {
    const { _page, _snackbarOpened, _offline } = this
    // Anything that's related to rendering should be done in here.
    return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

        --app-primary-color: #ff6f00;
        --app-secondary-color: #fbc02d;
        --app-primary-color-text: white;
        --app-secondary-color-text: white;

        --mdc-theme-primary: var(--app-primary-color);
        --mdc-theme-on-primary: var(--app-primary-color-text);
        --mdc-theme-secondary: var(--app-secondary-color);
        --mdc-theme-on-secondary: var(--app-secondary-color-text);
  
      }


      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }


      /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout. */
      @media (min-width: 460px) {
      }
    </style>

    <!-- Main content -->
    <main role="main" class="main-content">
      <button-view class="page" ?active="${_page === 'button-view'}" @redirect="${e => this._locationChanged(window.location)}"></button-view>
      <settings-view class="page" ?active="${_page === 'settings-view'}" @updateSecret="${e => this._updateSecret()}" @redirect="${e => this._locationChanged(window.location)}"></settings-view>
      <my-view404 class="page" ?active="${_page === 'view404'}"></my-view404>
    </main>

    <snack-bar ?active="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `
  }

  static get properties () {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
    }
  }

  constructor () {
    super()
    this._drawerOpened = false
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true)
    this._updateSecret()
  }

  _updateSecret () {
    this._secret = localStorage.getItem('secret')
  }

  firstUpdated () {
    installRouter((location) => this._locationChanged(location))
    installOfflineWatcher((offline) => this._offlineChanged(offline))
    installMediaQueryWatcher(`(min-width: 460px)`,
      (matches) => this._layoutChanged(matches))
  }

  updated (changedProps) {
  }

  _layoutChanged (isWideLayout) {
  }

  _offlineChanged (offline) {
    const previousOffline = this._offline
    this._offline = offline

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return
    }

    clearTimeout(this.__snackbarTimer)
    this._snackbarOpened = true
    this.__snackbarTimer = setTimeout(() => {
      this._snackbarOpened = false
    }, 3000)
  }

  _locationChanged (loc) {
    const path = window.decodeURIComponent(window.location.pathname)
    let page = path === '/' ? 'button-view' : path.slice(1)

    if (!this._secret || !this._secret.trim().length) {
      page = 'settings-view'
    }
    this._page = page
  }
}

window.customElements.define('my-app', MyApp)
