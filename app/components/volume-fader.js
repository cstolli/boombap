import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['volume-fader'],
  classNameBindings: ['isGrabbed'],
  range: {min: 0, max: 72},
  isGrabbed: false,
  gain: 0.9,
  normalizedGain: Ember.computed(function () {
    return 60 / (this.get('range').max - this.get('range').min)
  }),
  volume: Ember.computed('gain', {
    get(key) {
      return Math.round(this.get('gain') * (this.get('range').max - this.get('range').min) - 60)
    },
    set(key, value) {
      return value
    }
  }),
  value: Ember.computed('gain', {
    get(key) {
      return this.get('gain') * (this.get('range').max - this.get('range').min)
    },
    set(key, value) {
      return value
    }
  }),
  doubleClick () {
    this.get('onChange')(this.get('normalizedGain'))
  },
  scale: Ember.computed('', function () {
    return [
      {value: 12, yPos: '8px'},
      {value: 0, yPos: '23%'},
      {value: -60, yPos: '100%'}
    ]
  }),
  getSizeRange () {
    const max = this.$() ? this.$().height() : 0
    return {min: 0, max}
  },
  getSliderHeight () {
    if (!this.$('.slider')) {
      return
    }
    return this.$('.slider').height()
  },
  actions: {
    sliderChange (event) {
      const range = this.get('range').max - this.get('range').min
      const relativeGain = event.target.value / range
      this.get('onChange')(relativeGain)
    }
  }
});
