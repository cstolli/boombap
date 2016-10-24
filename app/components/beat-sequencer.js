/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:13:29-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-23T21:15:04-07:00
* @License: MIT
*/

import Ember from 'ember'
import _ from 'lodash'

export default Ember.Component.extend({
  classNames: ['beat-sequencer'],
  sequence: Ember.computed('pattern', 'divisions', 'timeSignature', function () {
    const divisions = this.get('divisions')
    const pattern = this.get('pattern')
    const {num} = this.get('timeSignature')
    const length = this.get('length')
    return [...Array(length).keys()].map((empty, bar) => {
      return {
        bar: bar + 1,
        beats: [...Array(num).keys()].map((empty, beat) => {
          return {
            bar: bar + 1,
            beat: beat + 1,
            divisions: [...Array(divisions).keys()].map((div) => {
              const number = `${(beat * divisions + div + 1) + (bar * num * divisions)}`
              const location = `${bar + 1}:${beat + 1}:${div + 1}`
              return {
                bar,
                beat,
                div,
                number,
                location,
                note: pattern[location] || undefined
              }
            })
          }
        })
      }
    })
  }),
  actions: {
    onChange (location) {
      this.get('onChange')(location, this.get('selectedChannel'))
    }
  }
})
