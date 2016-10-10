import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['beat-sequencer-slot'],
  classNameBindings: ['active'],
  active: false,
  click () {
    this.toggleProperty('active')
  }
});
