const context = new window.AudioContext()
import Ember from 'ember'
const Promise = Ember.RSVP.Promise

function trigger(number) {
  const channel = getChannel(number)
  const source = context.createBufferSource()
  const playback = new Promise((resolve, reject) => {
    source.onended = () => {
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

function getChannel(channelNumber) {
  return mixer.channels[channelNumber]
}

function setSample(sample, channelNumber) {
  getChannel(channelNumber).sample = sample
}

function createChannel (label, options = {}) {
  const panner = context.createStereoPanner()
  const gain = context.createGain()
  const analyser = context.createAnalyser()
  panner.connect(gain)
  gain.connect(analyser)
  analyser.connect(context.destination)
  const channel = {
    label: label || options.label || '',
    source: panner,
    gain,
    analyser,
    setSample,
    trigger,
    options
  }
  return channel
}

function createMasterChannel (numChannels) {
  const source = context.createChannelMerger(numChannels)
  const panner = context.createStereoPanner()
  const gain = context.createGain()
  const analyser = context.createAnalyser()
  source.connect(panner)
  panner.connect(gain)
  gain.connect(analyser)
  analyser.connect(context.destination)
  return {
    label: 'master',
    source,
    gain,
    analyser
  }
}

function loadFileSource (file, channel) {
  const reader = new FileReader()
  const result = new Promise((resolve, reject) => {
    reader.onload = function(e) {
      context.decodeAudioData(reader.result, (buffer) => {
        setSample(buffer, channel)
        resolve(reader.results)
      })
    }
  })
  reader.readAsArrayBuffer(file)
  return result
}

function loadUrlSource (url, channel) {
  var oReq = new XMLHttpRequest();
  const result = new Promise((resolve, reject) => {
    oReq.onload = (response) => {
      context.decodeAudioData(response.target.response, (buffer) => {
        setSample(buffer, channel)
        resolve(buffer)
      })
    }
    oReq.onerror = (err) => {
      console.log(err)
    }
    oReq.responseType = "arraybuffer";
    oReq.open("GET", url, true);
    oReq.send()
  })
}

const mixer = {
  context,
  channels: {
    1: createChannel(),
    master: createMasterChannel(8)
  },
  loadFileSource,
  loadUrlSource,
  createChannel
}

export default mixer
