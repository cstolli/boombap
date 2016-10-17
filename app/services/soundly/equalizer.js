/**
*                         _ _
*   ___  __ _ _   _  __ _| (_)_______ _ __
*  / _ \/ _` | | | |/ _` | | |_  / _ \ '__|
* |  __/ (_| | |_| | (_| | | |/ /  __/ |
*  \___|\__, |\__,_|\__,_|_|_/___\___|_|
*          |_|
*
* @Author: chrisstoll
* @Date:   2016-10-16T16:51:16-07:00
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T18:58:57-07:00
*/

import Filter from './filter'

/**
 * createEqualizer - description
 * @param  {Object} bandConfigs   the bands to create filters for
 * @param  {AudioContext} context the audio context to use
 * @return {Soundly.Equalizer}    a Soundly Equalizer
 */
function createEqualizer (context, bandConfigs) {
  const input = context.createGain()
  const output = context.createGain()
  const filters = bandConfigs.reduce((seed, band, index, allBands) => {
    const filter = Filter.createFilter(context, band)
    input.connect(filter)
    filter.connect(output)
    seed.push(filter)
    return seed
  }, [])
  return {
    bands: filters,
    input: input,
    output: output
  }
}

/**
 * public API
 */
export default {
  createEqualizer
}
