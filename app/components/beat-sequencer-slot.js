/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:14:00-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-23T21:16:01-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['beat-sequencer-slot'],
  classNameBindings: ['active', 'playing'],
  active: Ember.computed('note', function () {
    return !!this.get('note')
  }),
  playing: Ember.computed('playingDivision', function () {
    return parseInt(this.get('number'), 10) === this.get('playingDivision')
  }),
  click () {
    this.get('onChange')(this.get('location'), 10)
  }
})
