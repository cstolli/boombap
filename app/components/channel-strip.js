/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-22T22:18:09-07:00
* @License: MIT
*/

import Ember from 'ember'
import _ from 'lodash'

export default Ember.Component.extend({
  classNames: ['channel-strip'],
  classNameBindings: ['focused', 'mute', 'solo'],
  attributeBindings: ['tabindex', 'droppable'],
  droppable: 'droppable',
  keyRing: Ember.inject.service(),
  soundly: Ember.inject.service(),
  mute: Ember.computed('channel.mute', function () {
    return this.get('channel.mute')
  }),

  style: Ember.computed('relativeVolume', function () {
    return Ember.String.htmlSafe(`opacity: ${this.get('relativeVolume')}`)
  }),

  solo: Ember.computed('channel.solo', function () {
    return this.get('channel.solo')
  }),

  tabindex: Ember.computed('channel', function () {
    return this.get('channel.number')
  }),

  focused: Ember.computed('selectedChannel', function () {
    return this.get('selectedChannel') === this.get('channel.number')
  }),

  didReceiveAttrs (attrs) {
    if (this.get('selectedChannel') === this.get('channelNumber')) {
      this.get('keyRing').listen(this, '.solo, .mute', null)
    } else {
      this.get('keyRing').stopListening(this, '.solo, .mute')
    }
  },

  actions: {
    onVolumeChange (value) {
      this.get('onVolumeChange')(value, this.get('channelNumber'))
    },

    onMute () {
      this.get('onMute')(this.get('channelNumber'))
    },

    onSolo (event) {
      this.get('onSolo')(this.get('channelNumber'))
    },

    onSelectSource (file) {
      this.get('onSelectSource')(file, this.get('channelNumber'))
    },

    onPanChange (value) {
      this.get('onPanChange')(value, this.get('channelNumber'))
    },

    onTrigger () {
      this.get('onTrigger')(this.get('channelNumber'))
    },

    onLetterM (type, modifiers) {
      if (type !== 'keyup') return
      this.actions.onMute.call(this)
    },

    onLetterS (type, modifiers) {
      if (type !== 'keyup') return
      this.actions.onSolo.call(this)
    },

    onRightArrow (type, modifiers) {
      if (type !== 'keyup') return
      const delta = modifiers.shift ? 0.5 : 0.1
      this.get('onPanChange')(Math.min(this.get('pan') + delta, 1), this.get('channelNumber'))
    },

    onLeftArrow (type, modifiers) {
      if (type !== 'keyup') return
      const delta = modifiers.shift ? 0.5 : 0.1
      this.get('onPanChange')(Math.max(this.get('pan') - delta, -1), this.get('channelNumber'))
    },

    onEqChange () {
      this.get('onEqChange')(...arguments, this.get('channelNumber'))
    }
  },

  init () {
    this._super(...arguments)
    const analyser = this.get('soundly').Mixer.getChannelAnalyser(this.get('channelNumber'))
    analyser.fftSize = 2048
    this.animate(analyser)
  },

  animate (analyser) {
    window.requestAnimationFrame(() => {
      this.animate(...arguments)
    })
    if (this.get('triggered')) {
      this.visualize(analyser)
    }
  },

  visualize (analyser) {
    let bufferLength = analyser.fftSize
    let dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    let average = _.reduce(dataArray, (value, seed) => {
      return value + seed
    }, 0) / dataArray.length
    const range = 30
    let percent = average / range
    const relativeVolume = Ember.String.htmlSafe(Math.min(1, percent))
    if (this.getWithDefault('relativeVolume', Ember.String.htmlSafe('')).string === relativeVolume.string) {
      return
    }
    this.set('relativeVolume', relativeVolume)
  },

  focusIn () {
    this.get('onSelect')(this.get('channel.number'))
  },

  focusOut (event) {
    // this.get('onSelect')(null)
  }
})
