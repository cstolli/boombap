/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-25T23:37:33-07:00
* @License: MIT
*/

import Ember from 'ember'
import _ from 'lodash'

import instruments from '../assets/instruments'
const {channels, masterChannel, eqBands} = instruments.boombap.defaults

channels.map(channel => {
  channel.eq = _.clone(eqBands.map((band) => _.clone(band)))
})
masterChannel.eq = _.clone(eqBands.map((band) => _.clone(band)))

let currentInterval = 1

export default Ember.Component.extend({
  classNames: ['boom-bap'],
  attributeBindings: ['style'],
  playingDivision: 0,
  channels,
  masterChannel,
  selectedChannel: 1,
  ajax: Ember.inject.service(),
  soundly: Ember.inject.service('soundly'),
  keyRing: Ember.inject.service('keyRing'),
  midiChannels: [...Array(10).keys()].map((index) => index + 1),
  totalDivisions: Ember.computed('pattern.patternLength', 'project.divisions', 'project.timeSignature', function () {
    const {num} = this.get('project.timeSignature')
    const divisions = this.get('project.divisions')
    const patternLength = this.get('pattern.length')
    return patternLength * num * divisions
  }),

  style: Ember.computed('height', function () {
    return `height: ${this.get('height')}px;`
  }),

  midiChannel: Ember.computed('track', 'index', function () {
    return this.get('track').midiChannel || this.get('index') + 1
  }),

  init () {
    this._super(...arguments)
    const soundly = this.get('soundly')
    this.get('channels').map((channel) => {
      channel.input = soundly.Mixer.addChannel(channel.label, channel)
    })
    this.loadDefaultSoundBank()
    this.set('selectedPattern', this.get('pattern').notes[this.get('channels')[0].note])
  },

  isDifferent ({newAttrs, oldAttrs}, attr) {
    return oldAttrs && newAttrs[attr].value !== oldAttrs[attr].value
  },

  didReceiveAttrs ({newAttrs, oldAttrs}) {
    if (this.isDifferent(...arguments, 'playing')) {
      if (this.get('playing')) {
        this.set('player', this.runAnimationLoop())
      }
      if (!this.get('playing')) {
        this.get('player').then(() => { currentInterval = 1 })
      }
    }
    if (oldAttrs && newAttrs.restart.value) {
      currentInterval = 1
    }
    if (this.isDifferent(...arguments, 'midiEvent')) {
      this.handleMidiEvent()
    }
  },

  handleMidiEvent () {
    const midi = this.get('midiEvent')
    const channel = this.get('channels').findBy('note', midi.noteLetter)
    if (!channel || midi.type === 128 || midi.channel !== this.get('midiChannel')) return
    this.triggerChannel(channel.number)
  },

  runAnimationLoop () {
    let then = window.performance.now()
    let now, elapsed

    this.set('playing', true)
    const loop = (resolve, reject) => {
      const bps = this.get('project.tempo') / 60 // turn BPM into BPS
      const bpsInterval = 1000 / (bps * this.get('project.divisions'))

      if (this.get('playing')) {
        window.requestAnimationFrame(() => {
          loop(resolve, reject)
        })
      } else {
            // this.set('playingDivision', 0)
        resolve('stopped')
      }

      now = window.performance.now()
      elapsed = now - then
      if (elapsed > bpsInterval || elapsed === 0) {
        this.sequence(currentInterval)
        currentInterval++
        if (currentInterval === this.get('totalDivisions') + 1) {
          currentInterval = 1
        }
        then = now - (elapsed % bpsInterval)
      }
    }

    return new Promise((resolve, reject) => {
      loop(resolve, reject)
    })
  },

  getLocationFromInterval (interval) {
    const divisions = this.get('project.divisions')
    const {num} = this.get('project.timeSignature')
    const barLength = num * divisions
    const bar = Math.ceil(interval / barLength)
    const beat = Math.ceil(interval / divisions) - ((bar - 1) * num)
    const div = interval - (((bar - 1) * barLength) + ((beat - 1) * divisions))
    const location = `${bar}:${beat}:${div}`
    return location
  },

  sequence (division) {
    this.set('playingDivision', division)
    const location = this.getLocationFromInterval(division)
    this.get('channels').map((channel) => {
      const pattern = this.get('pattern').notes[channel.note]
      if (!pattern || !pattern[location]) return
      if (pattern[location]) {
        this.triggerChannel(channel.number)
      }
    })
  },

  actions: {
    selectChannel (value) {
      const channel = this.get('channels').findBy('number', value)
      this.setProperties({
        selectedPattern: this.get('pattern').notes[channel.note] || {},
        selectedChannel: value
      })
    },

    soloChannel (channelNumber) {
      const soloed = this.get('soundly').Mixer.toggleChannelSolo(channelNumber)
      const channel = this.get('channels').findBy('number', channelNumber)
      Ember.set(channel, 'solo', soloed)
    },

    muteChannel (channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber)
      const muted = this.get('soundly').Mixer.toggleChannelMute(channelNumber)
      Ember.set(channel, 'mute', muted)
    },

    channelVolume (value, channelNumber) {
      this.get('soundly').Mixer.setChannelVolume(channelNumber, value)
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      Ember.set(channel, 'volume', value)
    },

    setPattern (location, channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      let pattern = _.cloneDeep(this.get('pattern'))
      let part = pattern.notes[channel.note] || {}
      if (!part[location]) {
        part[location] = {
          length: 1,
          velocity: 100,
          quantize: 100
        }
        pattern.notes[channel.note] = part
      } else {
        delete pattern.notes[channel.note][location]
      }
      this.set('pattern', pattern)
      this.set('selectedPattern', pattern.notes[channel.note])
    },

    triggerSource (channelNumber) {
      this.triggerChannel(channelNumber)
    },

    panChannel (value, channelNumber) {
      this.get('soundly').Mixer.setChannelPan(channelNumber, value)
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      Ember.set(channel, 'pan', value)
    },

    eqChange (attr, value, bandNumber, channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      this.get('soundly').Mixer.setChannelEq(channelNumber, bandNumber, attr, value)
      const eq = Ember.get(channel, 'eq')
      Ember.set(eq[bandNumber - 1], attr, value)
    },

    selectSource (file, channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber)
      this.get('soundly').Sampler.loadFileSource(file, channelNumber)
        .then((sound) => {
          Ember.set(channel, 'input', sound)
          Ember.set(channel, 'sourceLabel', file.name)
        })
    },

    onChangeMidiDevice ({target}) {
      this.set('midiDevice', target.value)
    },

    onChangeMidiChannel ({target}) {
      this.set('midiChannel', parseInt(target.value, 10))
    }
  },

  triggerChannel (channelNumber) {
    const channel = this.get('channels').findBy('number', channelNumber)
    Ember.set(channel, 'triggered', true)
    this.get('soundly').Sampler.trigger(channelNumber)
      .then(() => {
        Ember.set(channel, 'triggered', false)
      })
      .catch(() => {
        Ember.set(channel, 'triggered', false)
      })
  },

  //
  loadDefaultSoundBank () {
    const channels = this.get('channels')
    const defaultBank = 'sounds/drums/808-1'
    this.get('ajax').request(`${defaultBank}/bank.json`)
      .then((bank) => {
        channels.map((channel) => {
          const url = `${defaultBank}/${bank.sounds[channel.number]}`
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
