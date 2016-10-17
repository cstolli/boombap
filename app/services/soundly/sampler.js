/**
*                            _
*  ___  __ _ _ __ ___  _ __ | | ___  _ ___
* / __|/ _` | '_ ` _ \| '_ \| |/ _ \| '_  \
* \__ \ (_| | | | | | | |_) | |  __/| | '-'
* |___/\__,_|_| |_| |_| .__/|_|\___||_|
*                     |_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T19:47:20-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T20:33:04-07:00
* @License: MIT
*/

/* global: File */

import patterns from 'npm:validator'

import {SAMPLER} from './strings'
import utils from './utils'

function createSample (source, channel) {
  if (patterns.isURL(source)) {
    return loadUrlSource(source, channel)
  }
  if (source instanceof window.File && utils.isFileAudio(source)) {
    return loadFileSource(source, channel)
  }
  return Promise.reject(new Error(SAMPLER.ERRORS.NO_SOURCE))
}

function loadFileSource (file, channel) {
  const reader = new window.FileReader()
  const result = new Promise((resolve, reject) => {
    reader.onload = function () {
      sampler.context.decodeAudioData(reader.result, (buffer) => {
        resolve(sampler.mixer.setSample(buffer, file, channel))
      })
    }
  })
  reader.readAsArrayBuffer(file)
  return result
}

function loadUrlSource (url, channel) {
  var oReq = new window.XMLHttpRequest()
  var meta = {
    url,
    name: url.split('/').pop()
  }
  const result = new Promise((resolve, reject) => {
    oReq.onload = (response) => {
      sampler.context.decodeAudioData(response.target.response, (buffer) => {
        resolve(sampler.mixer.setSample(buffer, meta, channel))
      })
    }
    oReq.onerror = (err) => {
      console.warn(`${url} not loaded, error: ${err}`)
    }
    oReq.responseType = 'arraybuffer'
    oReq.open('GET', url, true)
    oReq.send()
  })
  return result
}

function trigger (number) {
  const channel = sampler.mixer.getChannel(number)
  const source = sampler.context.createBufferSource()
  const playback = new Promise((resolve, reject) => {
    source.onended = () => {
      source.disconnect()
      resolve()
    }
    if (!channel.sample) {
      reject()
    } else {
      source.buffer = channel.sample
    }
  })
  source.connect(channel.source)
  source.start()
  return playback
}

const sampler = {
  context: null,
  mixer: null,
  createSample,
  loadFileSource,
  loadUrlSource,
  trigger
}

export default sampler
