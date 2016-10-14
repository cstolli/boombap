import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['volume-fader'],
  classNameBindings: ['isGrabbed'],
  range: {min: 0, max: 72},
  isGrabbed: false,
  gain: 0.9,
  keyRing: Ember.inject.service(),
  normalizedGain: Ember.computed(function () {
    return 60 / (this.get('range').max - this.get('range').min)
  }),
  init () {
    this._super(...arguments)
  },
  didRender () {
    this.get('keyRing').listen(this)
  },
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
      {value: 12, style: Ember.String.htmlSafe('top: 8px;')},
      {value: 0, style: Ember.String.htmlSafe('top: 23%;')},
      {value: -60, style: Ember.String.htmlSafe('top: 100%;')}
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
      event.preventDefault()
      return false
    },
    onUpArrow (type, modifiers) {
      if (this.get('channelNumber') === 'master') return
      if (this.get('selectedChannel') !== this.get('channelNumber')) return
      switch (type) {
        case 'keydown':
          const input = this.$('input[type=range]')
          const currentValue = parseInt(input.val(), 10)
          const increment = modifiers.shift ? 10 : 1
          input.val(currentValue + increment)
          input.trigger('input')
          return null
      }
    },
    onDownArrow (type, modifiers) {
      if (this.get('channelNumber') === 'master') return
      if (this.get('selectedChannel') !== this.get('channelNumber')) return
      switch (type) {
        case 'keydown':
          const input = this.$('input[type=range]')
          const currentValue = parseInt(input.val(), 10)
          const increment = modifiers.shift ? 10 : 1
          input.val(currentValue - increment)
          input.trigger('input')
          return null
      }
    }
  }
});
