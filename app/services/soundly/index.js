/**
*                            _ _
*  ___  ___  _   _ _ __   __| | |_   _
* / __|/ _ \| | | | '_ \ / _` | | | | |
* \__ \ (_) | |_| | | | | (_| | | |_| |
* |___/\___/ \__,_|_| |_|\__,_|_|\__, |
*                                |___/
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-11T01:25:01-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T20:14:31-07:00
* @License: MIT
*/

/**
 * variables
 */
const context = new window.AudioContext()

/**
 * soundly lib imports
 */
import Channel from './channel'
import Equalizer from './equalizer'
import Filter from './filter'
import Mixer from './mixer'
import Sampler from './sampler'
import utils from './utils'

function time () {
  return context.currentTime
}

function initMixer () {
  Mixer.context = context
  Mixer.channels.master = Channel.createMasterChannel(Mixer.context, {volume: 0})
}

function initSampler () {
  Sampler.context = context
  Sampler.mixer = Mixer
}

initMixer()
initSampler()

const soundly = {
  context,
  Channel,
  Equalizer,
  Filter,
  Mixer,
  Sampler,
  time,
  utils
}

export default soundly
