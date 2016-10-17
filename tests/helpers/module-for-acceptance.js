/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:26:21-07:00
* @License: MIT
*/

import { module } from 'qunit'
import Ember from 'ember'
import startApp from '../helpers/start-app'
import destroyApp from '../helpers/destroy-app'

const { RSVP: { Promise } } = Ember

export default function (name, options = {}) {
  module(name, {
    beforeEach () {
      this.application = startApp()

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments)
      }
    },

    afterEach () {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments)
      return Promise.resolve(afterEach).then(() => destroyApp(this.application))
    }
  })
}
