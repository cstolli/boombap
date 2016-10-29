/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-28T22:59:23-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-28T23:58:33-07:00
* @License: MIT
*/

import $ from 'jquery'
import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['wave-viz'],
  soundly: Ember.inject.service(),
  resizeHandler: null,
  canvasOrSvg: 'canvas',
  didRender () {
    this.eventHandler = this.drawSample.bind(this)
    this.drawSample()
    $(window).resize(this.eventHandler)
  },
  drawSample () {
    const sample = this.get('sample')
    if (!sample) return
    this.$('svg').empty()
    // this.get('soundly').Visualizer.draw(this.$('svg')[0], sample, '#000000')
    this.get('soundly').Visualizer.draw(this.$('canvas')[0], sample, '#FFFFCC')
  },
  willDestroy () {
    $(window).off('resize', this.resizeHandler)
  }
})
