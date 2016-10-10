import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pan-knob'],
  classNameBindings: ['isGrabbed'],
  attributeBindings: ['draggable'],
  draggable: "true",
  isGrabbed: false,
  dragStartPos: 0,
  sensitivity: 2,
  range: [-50, 50],
  value: 0,
  doubleClick () {
    this.set('value', 0)
  },
  knobAngle: Ember.computed('value', function () {
    const value = this.get('value')
    const tared = value + 50
    const relativeValue = tared / 100
    const taredAngle = 280 * relativeValue
    const angle = taredAngle - 140
    // console.log(angle)
    return angle
  }),
  dragStart (event) {
    var crt = this.$('.drag-helper')[0]
    event.dataTransfer.setDragImage(crt, 0, 0);
    this.setProperties({
      dragStartPos: event.offsetX,
      isGrabbed: true
    })
  },
  drag (event) {
    const startPos = this.get('dragStartPos')
    const value = (event.offsetX - startPos) * this.get('sensitivity')
    if (value < -100 || value > 100) {
      return
    }
    const normalValue = Math.max(Math.min(value, 50), -50)
    this.set('value', normalValue)
  },
  dragEnd (event) {
    this.setProperties({
      isGrabbed: false
    })
    return false
  }
});
