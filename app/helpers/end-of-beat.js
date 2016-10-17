/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-12T19:10:32-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:47:51-07:00
* @License: MIT
*/

import Ember from 'ember'

export function endOfBeat ([division]) {
  return division.division === 4 && !(division.beat === 4)
}

export default Ember.Helper.helper(endOfBeat)
