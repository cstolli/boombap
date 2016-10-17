/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:48:13-07:00
* @License: MIT
*/

import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
})

export default Router
