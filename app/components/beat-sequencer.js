import Ember from 'ember'
import _ from 'lodash'

export default Ember.Component.extend({
  classNames: ['beat-sequencer'],
  divisions: Ember.computed('timeSignature', function () {
    return new Array(this.get('timeSignature').denominator)
  }),
  beats: Ember.computed('timeSignature', function () {
    return new Array(this.get('timeSignature').numerator)
  }),
  actions: {
    onChange(division) {
      this.get('onChange')(division, this.get('selectedChannel'))
    }
  }
});
