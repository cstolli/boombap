/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-09T01:09:14-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:49:43-07:00
* @License: MIT
*/

import Ember from 'ember'

let lastDragPos = null

export default Ember.Component.extend({
  classNames: ['eq-knob'],
  classNameBindings: ['isGrabbed'],
  attributeBindings: ['draggable'],
  draggable: 'true',
  isGrabbed: false,
  dragStartPos: 0,
  sensitivity: 2,
  range: [-15, 15],
  value: 0,
  svgStyle: Ember.computed('knobAngle', function () {
    return Ember.String.htmlSafe(`transform:rotate(${this.get('knobAngle')}deg)`)
  }),

  doubleClick () {
    this.get('onEqChange')('gain', 0, this.get('band').number)
  },

  knobAngle: Ember.computed('value', function () {
    const relativeValue = this.get('value') / (this.get('range')[1] - this.get('range')[0])
    const range = 135 // degrees
    const angle = Math.max(Math.min(relativeValue * range, range), -range)
    this.set('lastKnobAngle', angle)
    return angle
  }),

  dragStart (event) {
    var crt = this.$('.drag-helper')[0]
    event.dataTransfer.setDragImage(crt, 0, 0)
    this.setProperties({
      dragStartPos: event.offsetY,
      isGrabbed: true
    })
  },

  drag (event) {
    const startPos = lastDragPos || event.clientY
    const delta = (event.clientY - startPos)
    lastDragPos = event.clientY

    // hack required to not pick the last
    // lame HTML5 even that fires after dropping, ugh.
    if (delta < -10 || delta > 10 || !delta) {
      return
    }

    const value = this.get('value') - delta
    const normalValue = Math.max(Math.min(40, value), -40)
    Ember.run.later(() => {
      this.get('onEqChange')('gain', normalValue, this.get('band').number)
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
