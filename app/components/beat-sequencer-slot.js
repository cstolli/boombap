import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['beat-sequencer-slot'],
  classNameBindings: ['active', 'playing'],
  active: false,
  playing: Ember.computed('playingDivision', function () {
    return parseInt(this.get('number'), 10) === this.get('playingDivision')
  }),
  click () {
    this.get('onChange')(parseInt(this.get('number'), 10))
  }
});
