import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['eq-panel'],
  actions: {
    onEqChange () {
      this.get('onEqChange')(...arguments)
    }
  }
})
