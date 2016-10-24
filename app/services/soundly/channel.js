/**
*       _                            _
*   ___| |__   __ _ _ __  _ __   ___| |
*  / __| '_ \ / _` | '_ \| '_ \ / _ \ |
* | (__| | | | (_| | | | | | | |  __/ |
*  \___|_| |_|\__,_|_| |_|_| |_|\___|_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T17:52:06-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-23T15:32:02-07:00
* @License: MIT
*/

/**
 * soundly imports
 */
import Equalizer from './equalizer'
import Compressor from './compressor'
import utils from './utils'

/**
 * createChannel - create a soundly channel
 * @param  {AudioContext} context the context to use
 * @param  {AudioNode} destination some node to plug this channel into
 * @param  {Object} options = {} the config options for the channel
 * @return {Soundly.Channel} a soundly channel object
 */
function createChannel (context, destination, options = {}) {
  if (!options.number) {
    throw new Error('A channel must have a number')
  }
  const panner = context.createStereoPanner()
  const splitter = context.createChannelSplitter()
  const gain = context.createGain()
  const output = context.createGain()
  const analyser = context.createAnalyser()
  const equalizer = Equalizer.createEqualizer(context, options.eq)

  panner.pan.value = options.pan || 0
  gain.gain.value = utils.decibelsToGain(options.volume) || 0
  output.gain.value = 1

  equalizer.output.connect(gain)
  gain.connect(panner)
  panner.connect(output)
  output.connect(analyser)
  analyser.connect(splitter)
  splitter.connect(destination, 0, 0)
  splitter.connect(destination, 1, 1)
  const channel = {
    label: options.label || '',
    number: options.number,
    source: equalizer.input,
    mute: options.mute || false,
    solo: options.solo || false,
    panner,
    gain,
    output,
    analyser,
    equalizer
  }
  return channel
}

/**
 * createMasterChannel - create a master channel
 * @param  {AudioContext} context the context to use
 * @param  {Object} options a config options object
 * @return {Soundly.Channel} a soundly channel
 */
function createMasterChannel (context, options) {
  const source = context.createChannelMerger(2)
  const panner = context.createStereoPanner()
  const gain = context.createGain()
  const limiter = Compressor.createLimiter(context)
  const equalizer = Equalizer.createEqualizer(context, options.eq)
  gain.gain.value = utils.decibelsToGain(options.volume)
  panner.pan.value = 0
  const analyser = context.createAnalyser()
  source.connect(equalizer.input)
  equalizer.output.connect(panner)
  panner.connect(gain)
  gain.connect(analyser)
  analyser.connect(limiter)
  limiter.connect(context.destination)
  return {
    label: 'master',
    source,
    gain,
    panner,
    analyser,
    equalizer
  }
}

/**
 * public API
 */
export default {
  createChannel,
  createMasterChannel
}
