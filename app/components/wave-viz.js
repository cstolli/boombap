/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-28T22:59:23-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-29T01:05:57-07:00
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
    if (this.get('canvasOrSvg') === 'canvas') {
      this.get('soundly').Visualizer.draw(this.$('canvas')[0], sample, '#FFDD88')
    } else {
      this.get('soundly').Visualizer.draw(this.$('svg')[0], sample, '#FFFF88')
    }
  },
  willDestroy () {
    $(window).off('resize', this.resizeHandler)
  }
})
