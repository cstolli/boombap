/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:26:17-07:00
* @License: MIT
*/

import Ember from 'ember'

export default function destroyApp (application) {
  Ember.run(application, 'destroy')
}
