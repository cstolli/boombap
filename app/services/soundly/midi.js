
/**
*            _     _ _
*  _ __ ___ (_) __| (_)
* | '_ ` _ \| |/ _` | |
* | | | | | | | (_| | |
* |_| |_| |_|_|\__,_|_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-25T19:37:38-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-25T19:48:02-07:00
* @License: MIT
*/

let midi = null

function getMidi () {
  if (midi) return Promise.resolve(midi)
  if (!navigator.requestMIDIAccess) {
    return Promise.reject('This browser does not allow MIDI access.')
  }
  return navigator.requestMIDIAccess()
    .then((midiAccess) => {
      midi = midiAccess
      return midi
    })
    .catch((error) => {
      console.warn(error)
    })
}

export default {
  getMidi
}
