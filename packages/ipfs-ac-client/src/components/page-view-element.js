/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { LitElement } from '@polymer/lit-element'
import { redirect } from '../util.js'

export class PageViewElement extends LitElement {
  // Only render this page if it's actually visible.
  shouldUpdate () {
    return this.active
  }

  redirect (url) {
    redirect(url)
    this.dispatchEvent(new CustomEvent('redirect', { details: { url } }));
  }

  static get properties () {
    return {
      active: { type: Boolean }
    }
  }
}
