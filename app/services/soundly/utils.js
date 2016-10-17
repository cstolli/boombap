/**
*        _   _ _
*  _   _| |_(_) |___
* | | | | __| | / __|
* | |_| | |_| | \__ \
*  \__,_|\__|_|_|___/
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T18:00:17-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T20:35:11-07:00
* @License: MIT
**/

import {UTILS} from './strings'

/**
 * decibelsToGain - turn an absolute decibel amount into relative gain (0-1+)
 * @param  {Integer} decibels an absolute decibel amount
 * @return {Float}  relative gain (0-1+)
 */
function decibelsToGain (decibels) {
  return parseFloat(Math.pow(10, (decibels / 10)), 10)
}

/**
 * gainToDecibels - turn a relative (0-1+) gain amount into raw decibels
 * @param  {Float} gain a relative gain amount, 0-1+
 * @return {Integer}      an integer decibel amount
 */
function gainToDecibels (gain) {
  return Math.round(10 * Math.log(parseFloat(gain, 10)) / Math.LN10)
}

/**
 * isFileAudio - determine if file provided by the browser is audio or not
 * @param  {File} file a window.File type object
 * @return {Boolean}   true if file is an audio, false if not
 */
function isFileAudio (file) {
  if (!(file instanceof window.File)) throw new Error(UTILS.ERRORS.NOT_FILE)
  return ['audio/mpeg', 'audio/ogg', 'audio/wav'].includes(file.type)
}

/**
 * public API
 */
export default {
  decibelsToGain,
  gainToDecibels,
  isFileAudio
}
