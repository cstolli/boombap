/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:26:27-07:00
* @License: MIT
*/

import Ember from 'ember'
import Application from '../../app'
import config from '../../config/environment'

export default function startApp (attrs) {
  let application

  let attributes = Ember.merge({}, config.APP)
  attributes = Ember.merge(attributes, attrs) // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes)
    application.setupForTesting()
    application.injectTestHelpers()
  })

  return application
}
