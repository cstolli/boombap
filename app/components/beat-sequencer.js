/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:13:29-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T22:14:41-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['beat-sequencer'],
  actions: {
    onChange (division) {
      this.get('onChange')(division, this.get('selectedChannel'))
    }
  }
})
