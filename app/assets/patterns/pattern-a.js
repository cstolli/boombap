/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T21:57:34-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:57:51-07:00
* @License: MIT
*/
import Ember from 'ember'

export default {
  // kick
  kick: Ember.Object.create({
    1: Ember.Object.create({beat: 1, division: 1, active: true}),
    2: Ember.Object.create({beat: 1, division: 2, active: false}),
    3: Ember.Object.create({beat: 1, division: 3, active: false}),
    4: Ember.Object.create({beat: 1, division: 4, active: false}),
    5: Ember.Object.create({beat: 2, division: 1, active: false}),
    6: Ember.Object.create({beat: 2, division: 2, active: false}),
    7: Ember.Object.create({beat: 2, division: 3, active: false}),
    8: Ember.Object.create({beat: 2, division: 4, active: false}),
    9: Ember.Object.create({beat: 3, division: 1, active: true}),
    10: Ember.Object.create({beat: 3, division: 2, active: false}),
    11: Ember.Object.create({beat: 3, division: 3, active: true}),
    12: Ember.Object.create({beat: 3, division: 4, active: false}),
    13: Ember.Object.create({beat: 4, division: 1, active: false}),
    14: Ember.Object.create({beat: 4, division: 2, active: false}),
    15: Ember.Object.create({beat: 4, division: 3, active: false}),
    16: Ember.Object.create({beat: 4, division: 4, active: true})
  }),
  // clap
  clap: Ember.Object.create({
    1: Ember.Object.create({beat: 1, division: 1, active: false}),
    2: Ember.Object.create({beat: 1, division: 2, active: false}),
    3: Ember.Object.create({beat: 1, division: 3, active: false}),
    4: Ember.Object.create({beat: 1, division: 4, active: false}),
    5: Ember.Object.create({beat: 2, division: 1, active: true}),
    6: Ember.Object.create({beat: 2, division: 2, active: false}),
    7: Ember.Object.create({beat: 2, division: 3, active: false}),
    8: Ember.Object.create({beat: 2, division: 4, active: false}),
    9: Ember.Object.create({beat: 3, division: 1, active: false}),
    10: Ember.Object.create({beat: 3, division: 2, active: false}),
    11: Ember.Object.create({beat: 3, division: 3, active: false}),
    12: Ember.Object.create({beat: 3, division: 4, active: false}),
    13: Ember.Object.create({beat: 4, division: 1, active: true}),
    14: Ember.Object.create({beat: 4, division: 2, active: false}),
    15: Ember.Object.create({beat: 4, division: 3, active: false}),
    16: Ember.Object.create({beat: 4, division: 4, active: false})
  }),
  // hihat
  hihat: Ember.Object.create({
    1: Ember.Object.create({beat: 1, division: 1, active: true}),
    2: Ember.Object.create({beat: 1, division: 2, active: true}),
    3: Ember.Object.create({beat: 1, division: 3, active: true}),
    4: Ember.Object.create({beat: 1, division: 4, active: true}),
    5: Ember.Object.create({beat: 2, division: 1, active: true}),
    6: Ember.Object.create({beat: 2, division: 2, active: true}),
    7: Ember.Object.create({beat: 2, division: 3, active: true}),
    8: Ember.Object.create({beat: 2, division: 4, active: true}),
    9: Ember.Object.create({beat: 3, division: 1, active: true}),
    10: Ember.Object.create({beat: 3, division: 2, active: true}),
    11: Ember.Object.create({beat: 3, division: 3, active: true}),
    12: Ember.Object.create({beat: 3, division: 4, active: true}),
    13: Ember.Object.create({beat: 4, division: 1, active: true}),
    14: Ember.Object.create({beat: 4, division: 2, active: true}),
    15: Ember.Object.create({beat: 4, division: 3, active: true}),
    16: Ember.Object.create({beat: 4, division: 4, active: true})
  })
}
