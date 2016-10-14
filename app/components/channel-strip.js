import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['channel-strip'],
  classNameBindings: ['focused', 'mute', 'solo'],
  attributeBindings: ['tabindex'],
  keyRing: Ember.inject.service(),
  mute: Ember.computed('channel.mute', function () {
    return this.get('channel.mute')
  }),
  style: Ember.computed('relativeVolume', function () {
    return Ember.String.htmlSafe(`opacity: ${this.get('relativeVolume')};`)
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
  init () {
    this._super(...arguments)
    // this.get('keyRing').listen(this).ignore()
  },
  eqFrequencies: [
    {hz: 10000, gain: 0},
    {hz: 2000, gain: 0},
    {hz: 400, gain: 0}
  ],
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
      if (this.get('channelNumber') !== this.get('selectedChannel')) return
      if (type !== 'keyup') return
      this.actions.onMute.call(this)
    }
  },
  init () {
    this._super(...arguments)
    const analyser = this.get('channel.input.analyser')
    analyser.fftSize = 2048;
    this.animate(analyser)
  },
  animate(analyser) {
    requestAnimationFrame(() => {
      this.animate(...arguments)
    })
    if (this.get('triggered')) {
      this.visualize(analyser)
    }
  },
  visualize(analyser) {
    var bufferLength = analyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray)
    let average = _.reduce(dataArray, (value, seed) => {
        return value + seed;
    }, 0) / dataArray.length;
    const range = analyser.maxDecibels - analyser.minDecibels
    let percent = average / range;
    const relativeVolume = Ember.String.htmlSafe(Math.min(1, percent * 7))
    if (this.getWithDefault('relativeVolume', Ember.String.htmlSafe('')).string === relativeVolume.string) {
      return
    }
    this.set('relativeVolume', relativeVolume)
  },
  focusIn () {
    this.get('keyRing').listen(this, null, 'input')
    this.get('onSelect')(this.get('channel.number'))
  },
  focusOut () {
    this.get('keyRing').stopListening(this)
    this.get('onSelect')(null)
  }
});
