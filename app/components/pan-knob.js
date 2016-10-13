import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pan-knob'],
  classNameBindings: ['isGrabbed'],
  attributeBindings: ['draggable'],
  draggable: "true",
  isGrabbed: false,
  dragStartPos: 0,
  sensitivity: 2,
  range: [-1, 1],
  value: 0,
  svgStyle: Ember.computed('knobAngle', function () {
    return Ember.String.htmlSafe(`transform:rotate(${this.get('knobAngle')}deg);`)
  }),
  doubleClick () {
    this.setProperties({'value': 0, lastKnobAngle: 0})
  },
  knobAngle: Ember.computed('value', function () {
    const last = this.getWithDefault('lastKnobAngle', 0)
    const value = this.get('value')
    const range = 130 //degrees
    const angle = Math.max(Math.min(range, value * range + last), -range)
    this.set('lastKnobAngle', angle)
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

    const value = (event.offsetX - startPos)
    console.info(value)
    if (value < -200 || value > 200) {
      return
    }
    const normalValue = Math.max(Math.min(value, 100), -100)
    const relativeValue = normalValue / 100
    this.get('onPanChange')(relativeValue)
  },
  dragEnd (event) {
    this.setProperties({
      isGrabbed: false
    })
    return false
  }
});
