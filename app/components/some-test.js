/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-24T20:50:41-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-24T20:57:37-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  init () {
    this._super(...arguments)
    console.log('wtf')
  },
  didReceiveAttrs () {
    console.log('wtf')
  },
  didRender () {
    console.log('wtf')
  }
})
