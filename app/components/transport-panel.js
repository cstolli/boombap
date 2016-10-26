/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T20:01:19-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-25T23:35:49-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['transport-panel'],
  classNameBindings: ['playing'],
  beatDivisions: [3, 4, 6, 8],
  keyRing: Ember.inject.service(),

  didRender () {
    this.get('keyRing').listen(this, document, 'input')
  },

  playing: false,

  actions: {
    togglePlay () {
      this.get('togglePlay')()
    },

    changeTempo (event) {
      this.get('changeTempo')(event.target.value)
      event.preventDefault()
      return false
    },

    changeDivisions (event) {
      this.get('changeDivisions')(event.target.value)
      event.preventDefault()
      return false
    },

    onSpacebar (type, modifierKeys) {
      if (type !== 'keyup') return
      this.actions.togglePlay.call(this)
      return true
    },

    wheelIt () {
      this.get('wheelIt')()
    },

    stopPlay () {
      this.get('stopPlay')()
    }
  }
})
