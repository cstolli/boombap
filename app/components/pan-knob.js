/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:49:35-07:00
* @License: MIT
*/

import Ember from 'ember'

let lastDragPos = null

export default Ember.Component.extend({
  classNames: ['pan-knob'],
  classNameBindings: ['isGrabbed'],
  attributeBindings: ['draggable'],
  draggable: 'draggable',
  isGrabbed: false,
  dragStartPos: 0,
  sensitivity: 2,
  range: [-1, 1],
  value: 0,

  keyRing: Ember.inject.service(),

  svgStyle: Ember.computed('knobAngle', function () {
    return Ember.String.htmlSafe(`transform:rotate(${this.get('knobAngle')}deg)`)
  }),

  doubleClick () {
    this.setProperties({'value': 0, lastKnobAngle: 0})
  },

  knobAngle: Ember.computed('value', function () {
    const value = this.get('value')
    const range = 130 // degrees
    const angle = Math.max(Math.min(value * range, range), -range)
    this.set('lastKnobAngle', angle)
    return angle
  }),

  dragStart (event) {
    var crt = this.$('.drag-helper')[0]
    event.dataTransfer.setDragImage(crt, 0, 0)
    this.setProperties({
      isGrabbed: true
    })
  },

  drag (event) {
    const startPos = lastDragPos || event.clientX
    const delta = (event.clientX - startPos)
    lastDragPos = event.clientX

    // hack required to not pick the last
    // lame HTML5 even that fires after dropping, ugh.
    if (delta < -10 || delta > 10 || !delta) {
      return
    }

    const value = this.get('value') + delta / 25
    const normalValue = Math.max(Math.min(1, value), -1)
    Ember.run.later(() => {
      this.get('onPanChange')(normalValue)
    })
  },

  dragEnd (event) {
    lastDragPos = null
    this.setProperties({
      isGrabbed: false
    })
    return false
  }
})
