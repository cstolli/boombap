import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['transport-panel'],
  playing: false,
  actions: {
    togglePlay () {
      this.toggleProperty('playing')
    }
  }
});
