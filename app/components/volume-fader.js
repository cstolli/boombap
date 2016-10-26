/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-24T21:09:34-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['volume-fader'],
  classNameBindings: ['isGrabbed'],
  isGrabbed: false,
  keyRing: Ember.inject.service(),
  soundly: Ember.inject.service(),
  decibelRange: {min: -30, max: 6},
  getRangeSize () {
    return this.get('decibelRange').max - this.get('decibelRange').min
  },
  sliderValue: Ember.computed('volume', function () {
    return (this.get('volume') - this.get('decibelRange').min) / this.getRangeSize() * 100
  }),
  init () {
    this._super(...arguments)
  },

  didReceiveAttrs (attrs) {
    this._super(...arguments)
    if (this.get('selectedChannel') === this.get('channelNumber')) {
      this.get('keyRing').listen(this, 'input[type=range]', null)
    } else {
      this.get('keyRing').stopListening(this, 'input[type=range]')
    }
  },

  doubleClick () {
    this.get('onChange')(0)
  },

  scale: Ember.computed('', function () {
    return [
      {value: this.get('decibelRange').max, style: Ember.String.htmlSafe('top: 8px')},
      {value: 0, style: Ember.String.htmlSafe('top: 23%')},
      {value: this.get('decibelRange').min, style: Ember.String.htmlSafe('top: 100%')}
    ]
  }),

  getDecibelValue (value) {
    return Math.ceil(value / 100 * this.getRangeSize() + this.get('decibelRange').min)
  },

  actions: {
    sliderChange (event) {
      Ember.run.next(() => {
        this.get('onChange')(this.getDecibelValue(event.target.value))
      })
      event.preventDefault()
      return
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
          return false
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
          return false
      }
    }
  }
})
