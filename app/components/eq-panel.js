/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:48:36-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:49:44-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['eq-panel'],
  actions: {
    onEqChange () {
      this.get('onEqChange')(...arguments)
    }
  }
})
