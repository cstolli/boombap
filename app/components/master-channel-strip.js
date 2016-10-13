import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['channel-strip'],
  classNameBindings: ['focused', 'mute', 'solo'],
  attributeBindings: ['tabindex'],
  style: Ember.computed('relativeVolume', function () {
    return Ember.String.htmlSafe(`opacity: ${this.get('relativeVolume')};`)
  }),
  mute: Ember.computed('channel.mute', function () {
    return this.get('channel.mute')
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
  eqFrequencies: [
    {hz: 10000, gain: 0},
    {hz: 2000, gain: 0},
    {hz: 400, gain: 0}
  ],
  actions: {
    onVolumeChange (value) {
      this.get('onVolumeChange')(value, this.get('channelNumber'))
      return false;
    },
    onMute (event) {
      this.get('onMute')(this.get('channelNumber'))
    },
    onSolo (event) {
      this.get('onSolo')(this.get('channelNumber'))
    },
    onPanChange (value) {
      this.get('onPanChange')(value, this.get('channelNumber'))
    }
  },
  init () {
    this._super(...arguments)
    const analyser = this.get('channel.input.analyser')
    analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);
    this.animate(analyser, dataArray)
  },
  animate(analyser, dataArray) {
    requestAnimationFrame(() => {
      this.animate(...arguments)
    })
    this.visualize(analyser, dataArray)
  },
  visualize(analyser, dataArray) {
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
  }
});
