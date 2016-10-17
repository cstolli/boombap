/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:26:25-07:00
* @License: MIT
*/

import Resolver from '../../resolver'
import config from '../../config/environment'

const resolver = Resolver.create()

resolver.namespace = {
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix
}

export default resolver
