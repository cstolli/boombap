/**
 *   __   _   _   _
 *  / _| (_) | | | |_    ___   _ __
 * | |_  | | | | | __|  / _ \ | '__|
 * |  _| | | | | | |_  |  __/ | |
 * |_|   |_| |_|  \__|  \___| |_|
 *
 * @Author: Chris Stoll <chrisstoll>
 * @Date:   2016-10-15T11:51:03-07:00
 * @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T20:50:39-07:00
 * @License: MIT
 */

/**
 * createFilter - create a filter according to a spec
 * @param  {Object} options         a config object with filter params
 * @param  {AudioContext} context   the audio context
 * @return {Soundly.Filter}         a Soundly Filter Object
 */
function createFilter (context, options) {
  const biquadFilter = context.createBiquadFilter()
  biquadFilter.type = options.type || 'lowshelf'
  biquadFilter.frequency.value = options.frequency || 1000
  biquadFilter.gain.value = options.gain || 25
  biquadFilter.gain.value = options.detune || 0
  biquadFilter.gain.value = options.Q || 0.5
  return biquadFilter
}

/**
 * Public API
 */
export default {
  createFilter
}
