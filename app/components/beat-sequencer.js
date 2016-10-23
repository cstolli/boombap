/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:13:29-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-22T23:08:05-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['beat-sequencer'],
  sequence: Ember.computed('pattern', 'divisions', 'timeSignature', function () {
    const divisions = this.get('divisions')
    const pattern = this.get('pattern')
    const {numerator} = this.get('timeSignature')
    return [...Array(numerator).keys()].map((empty, beat) => {
      return {
        beat: beat + 1,
        divisions: [...Array(divisions).keys()].map((empty, div) => {
          const number = `${(beat) * divisions + div + 1}`
          const note = pattern.getWithDefault(number))
          note.set('number', number)
          return note
        })
      }
    })
  }),
  actions: {
    onChange (division) {
      this.get('onChange')(division, this.get('selectedChannel'))
    }
  }
})
