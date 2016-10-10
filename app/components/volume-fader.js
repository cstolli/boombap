import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['volume-fader'],
  classNameBindings: ['isGrabbed'],
  range: {min: 0, max: 72},
  isGrabbed: false,
  volume: Ember.computed('value', {
    get(key) {
      return this.get('value') - 60
    },
    set(key, value) {
      return value
    }
  }),
  value: Ember.computed('volume', {
    get(key) {
      return this.get('volume') + 60
    },
    set(key, value) {
      return value
    }
  }),
  doubleClick () {
    this.set('volume', 0)
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
      this.set('value', event.target.value)
      this.get('onChange')(this.get('volume'))
    }
  }
});
