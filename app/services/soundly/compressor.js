/**
*   ___ ___  _ __ ___  _ __  _ __ ___  ___ ___  ___  _ __
*  / __/ _ \| '_ ` _ \| '_ \| '__/ _ \/ __/ __|/ _ \| '__|
* | (_| (_) | | | | | | |_) | | |  __/\__ \__ \ (_) | |
*  \___\___/|_| |_| |_| .__/|_|  \___||___/___/\___/|_|
*                     |_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T18:12:26-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T18:57:36-07:00
* @License: MIT
*/

/**
 * createCompressor - create a compressor with specified params
 * @param  {Object} config description
 * @param  {AudioContext} context description
 * @return {type}         description
 */
function createCompressor (context, config = {}) {
  const compressor = context.createDynamicsCompressor()
  compressor.threshold.value = config.threshold || 0
  compressor.knee.value = config.knee || 0
  compressor.ratio.value = config.ratio || 0
  compressor.attack.value = config.attack || 0
  compressor.release.value = config.release || 0
  return compressor
}

/**
 * createLimiter - convenience method to get a hard limiter
 * @return {Soundly.Compressor}  A soundly compressor
 */
function createLimiter (context) {
  return createCompressor(context, {
    threshold: -0.3,         // a little bit of headroom
    knee: 0.0,               // hard, no give
    ratio: 20.0,             // the maximum compression
    attack: 0.005,           // something very short
    release: 0.050           // also quite fast
  })
}

/**
 * public API
 */
export default {
  createCompressor,
  createLimiter
}
