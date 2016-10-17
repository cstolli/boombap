/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T20:49:22-07:00
* @License: MIT
*/

import Ember from 'ember'
import _ from 'lodash'
const patterns = {
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

const channels = [
  {'number': 1, 'pattern': patterns.kick, 'label': '1', pan: 0, 'mute': false, 'solo': false, 'volume': -2, input: {}},
  {'number': 2, 'label': '2', pan: -0.3, 'mute': false, 'solo': false, 'volume': 1, input: {}},
  {'number': 3, 'pattern': patterns.clap, 'label': '3', pan: 0.3, 'mute': false, 'solo': false, 'volume': -10, input: {}},
  {'number': 4, 'label': '4', pan: 0.1, 'mute': false, 'solo': false, 'volume': -10, input: {}},
  {'number': 5, 'pattern': patterns.hihat, 'label': '5', pan: -0.1, 'mute': false, 'solo': false, 'volume': -10, input: {}},
  {'number': 6, 'label': '6', pan: -0.5, 'mute': false, 'solo': false, 'volume': -10, input: {}},
  {'number': 7, 'label': '7', pan: 0, 'mute': false, 'solo': false, 'volume': -10, input: {}},
  {'number': 8, 'label': '8', pan: 0.5, 'mute': false, 'solo': false, 'volume': -10, input: {}}
]

const bands = [
  {number: 1, type: 'peaking', gain: 0, frequency: 10000, Q: 0.5, detune: 0},
  {number: 2, type: 'peaking', gain: 0, frequency: 3000, Q: 0.5, detune: 0},
  {number: 3, type: 'peaking', gain: 0, frequency: 80, Q: 0.5, detune: 0}
]

channels.map(channel => {
  channel.eq = _.clone(bands.map((band) => _.clone(band)))
})

const masterChannel = {
  eq: bands,
  number: 'master',
  pan: 0,
  'label': 'Master',
  'mute': false,
  volume: 0,
  input: null
}

export default Ember.Controller.extend({
  soundly: Ember.inject.service(),
  ajax: Ember.inject.service(),
  channels,
  masterChannel,

  init () {
    this._super(...arguments)
    const soundly = this.get('soundly')
    this.get('channels').map((channel) => {
      channel.input = soundly.Mixer.addChannel(channel.label, channel)
    })
    this.loadDefaultSoundBank()
  },

  loadDefaultSoundBank () {
    const channels = this.get('channels')
    const defaultBank = 'sounds/drums'
    this.get('ajax').request(`${defaultBank}/bank.json`)
      .then((bank) => {
        channels.map((channel) => {
          const url = `/${defaultBank}/${bank.sounds[channel.number]}`
          this.get('soundly').Sampler.loadUrlSource(url, channel.number)
            .then(() => {
              Ember.run.later(() => {
                Ember.set(channel, 'sourceLabel', channel.input.sampleMeta.name)
              })
            })
        })
      })
  }
})
