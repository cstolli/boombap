import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['transport-panel'],
  classNameBindings: ['playing'],

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

    onSpacebar (type, modifierKeys) {
      if (type !== 'keyup') return
      this.actions.togglePlay.call(this)
      return true
    }
  }
})
