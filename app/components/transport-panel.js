import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['transport-panel'],
  classNameBindings: ['playing'],
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
  }
});
