import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  classNames: ['channel-strip'],
  classNameBindings: ['focused', 'mute', 'solo'],
  attributeBindings: ['tabindex'],
  mute: Ember.computed('channel.mute', function () {
    return this.get('channel.mute')
  }),
  solo: Ember.computed('channel.solo', function () {
    return this.get('channel.solo')
  }),
  volume: -10,
  tabindex: Ember.computed('channel', function () {
    return this.get('channel.number')
  }),
  focused: Ember.computed('selectedChannel', function () {
    return this.get('selectedChannel') === this.get('channel.number')
  }),
  gain: Ember.computed('', function () {
    return Math.fround(this.get('volume') + 60 / 72, 8)
  }),
  eqFrequencies: [
    {hz: 10000, gain: 0},
    {hz: 2000, gain: 0},
    {hz: 400, gain: 0}
  ],
  actions: {
    onVolumeChange (value) {
      console.log(value)
      this.set('volume', value)
    },
    onMute (event) {
      const gain = this.get('gain')
      const gainNode = this.get('channel.input.gain')
      gainNode.value = gainNode.value === 0 ? gain : 0
    },
    onSolo (event) {
      this.get('onSolo')(this.get('channel.number'))
    },
    onSelectSource (file) {
      this.get('onSelectSource')(file, this.get('channel.number'))
    },
    onTrigger() {
      const channel = this.get('channel.input')
      this.set('channel.triggered', true)
      channel.trigger(this.get('channel.number'))
        .then(() => {
          this.set('channel.triggered', false)
        })
        .catch(() => {
          this.set('channel.triggered', false)
        })
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
    this.set('relativeVolume', Ember.String.htmlSafe(Math.min(1, percent * 7 + 0.3)))
  },
  focusIn () {
    this.get('onSelect')(this.get('channel.number'))
    return false;
  }
});
