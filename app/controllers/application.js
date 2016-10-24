/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-23T16:02:46-07:00
* @License: MIT
*/

import Ember from 'ember'
import _ from 'lodash'

import project from '../assets/projects/beat-1/beat-1'
import instruments from '../assets/instruments'
import patterns from '../assets/projects/beat-1/patterns'

// inflate project instruments
project.tracks.forEach((track) => {
  if (!instruments[track.instrument.name]) throw new Error(`${track.instrument.name} is not a HeckaBeats instruments`)
  track.instrument = _.defaults(track.instrument, instruments[track.instrument.name])
})

// inflate project patterns
project.tracks.forEach((track) => {
  track.instrument.pattern = Ember.Object.create(
    _.defaults(track.instrument, patterns[track.instrument.pattern])
  )
})

export default Ember.Controller.extend({
  soundly: Ember.inject.service(),
  ajax: Ember.inject.service(),
  playingDivision: 0,
  patterns,
  timeSignature: {num: 4, denom: 4},
  project: Ember.Object.create(project),
  instruments: Ember.Object.create(instruments)
})
