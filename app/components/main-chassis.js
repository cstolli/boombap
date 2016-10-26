/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-24T19:42:15-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-25T23:36:27-07:00
* @License: MIT
*/

import Ember from 'ember'
import Notes from 'boombap/assets/frequencies'
import _ from 'lodash'

let currentInterval = 1

export default Ember.Component.extend({
  playing: false,
  soundly: Ember.inject.service(),
  projectData: Ember.computed('project', function () {
    return window.btoa(JSON.stringify(JSON.parse(JSON.stringify(this.get('project')))).trim().split(' ').join())
  }),

  init () {
    this._super(...arguments)
    this.startMidi()
  },

  startMidi () {
    this.get('soundly').MIDI.getMidi()
      .then((midi) => {
        const inputs = {}
        midi.inputs.forEach((input, key) => {
          inputs[key] = input
          input.onmidimessage = this.onMIDIMessage.bind(this)
        })
        this.set('midiInputs', inputs)
      })
  },

  onMIDIMessage (event) {
    const data = event.data
    const midiEvent = {
      cmd: data[0] >> 4,
      channel: (event.data[0] & 0x0f) + 1,
      type: data[0] & 0xf0,
      noteNumber: data[1],
      noteLetter: this.noteFromFrequency(this.frequencyFromNoteNumber(data[1])),
      noteFrequency: this.frequencyFromNoteNumber(data[1]),
      velocity: data[2]
    }
    this.set('midiEvent', midiEvent)
    console.log(midiEvent)
  },

  frequencyFromNoteNumber (noteNumber) {
    return Math.round(440 * Math.pow(2, (noteNumber - 69) / 12) * 100) / 100
  },

  noteFromFrequency (frequency) {
    return _.findKey(Notes, (freq) => freq === frequency)
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
        this.setProperties({
          'location': this.getLocationFromInterval(currentInterval),
          currentInterval
        })
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

  actions: {
    togglePlay () {
      this.set('playing', !this.get('playing'))
    },

    onSpacebar (type, modifiers) {
      if (type === 'keypress') {
        this.actions.togglePlay.call(this)
        return null
      }
    },

    wheelIt (division) {
      this.setProperties({
        restart: true
      })
      Ember.run.next(() => {
        this.set('restart', false)
      })
    },

    stopPlay () {
      this.setProperties({
        restart: false,
        playing: false
      })
    },

    changeTempo (tempo) {
      this.set('project.tempo', parseInt(tempo, 10))
    },

    changeDivisions (divisions) {
      this.set('project.divisions', parseInt(divisions, 10))
    },

    onSelectSource (file) {
      const reader = new window.FileReader()
      const result = new Promise((resolve, reject) => {
        reader.onload = function () {
          resolve(reader.result)
        }
      })
      reader.readAsText(file)
      result.then((data) => {
        const json = window.atob(data)
        if (!JSON.parse(json)) throw new Error('not a valid beat file')
        this.set('project', JSON.parse(json))
      })
    }
  }
})
