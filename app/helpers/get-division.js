/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-12T22:48:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:48:04-07:00
* @License: MIT
*/

import Ember from 'ember'

export function getDivision ([pattern, beat, division]) {
  return pattern[beat][division]
}

export default Ember.Helper.helper(getDivision)
