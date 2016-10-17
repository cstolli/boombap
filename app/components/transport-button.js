/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T20:01:30-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T22:17:15-07:00
* @License: MIT
*/

import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['transport-button'],
  click () {
    this.get('onClick')()
  }
})
