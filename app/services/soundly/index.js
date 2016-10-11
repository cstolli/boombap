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

function setSample(sample, meta, channelNumber) {
  getChannel(channelNumber).sample = sample
  getChannel(channelNumber).sampleMeta = meta
  return getChannel(channelNumber)
}

function createChannel (label, options = {}) {
  const panner = context.createStereoPanner()
  const splitter = context.createChannelSplitter()
  const gain = context.createGain()
  const output = context.createGain()
  const analyser = context.createAnalyser()

  panner.pan.value = options.pan || 0
  gain.gain.value = options.gain || 0
  output.gain.value = 1

  panner.connect(gain)
  gain.connect(analyser)
  gain.connect(splitter)
  splitter.connect(getChannel('master').source, 0, 0)
  splitter.connect(getChannel('master').source, 1, 1)
  const channel = {
    label: label || options.label || '',
    source: panner,
    panner,
    gain,
    output,
    analyser,
    setSample,
    trigger
  }
  return channel
}

function toggleChannelMute(channelNumber){
  const outputGain = getChannel(channelNumber).output.gain
  outputGain.value = outputGain.value === 1 ? 0 : 1
  return !!!outputGain.value
}

function createMasterChannel (numChannels, options) {
  const source = context.createChannelMerger(2)
  const panner = context.createStereoPanner()
  const gain = context.createGain()
  gain.gain.value = 1
  panner.pan.value = 0
  const analyser = context.createAnalyser()
  source.connect(panner)
  panner.connect(gain)
  gain.connect(analyser)
  analyser.connect(context.destination)
  return {
    label: 'master',
    source,
    gain,
    panner,
    analyser
  }
}

function setChannelPan (channelNumber, value) {
  getChannel(channelNumber).panner.pan.value = value
}

function setChannelVolume (channelNumber, value) {
  getChannel(channelNumber).gain.gain.value = value
}

function loadFileSource (file, channel) {
  const reader = new FileReader()
  const result = new Promise((resolve, reject) => {
    reader.onload = function(e) {
      context.decodeAudioData(reader.result, (buffer) => {
        resolve(setSample(buffer, file, channel))
      })
    }
  })
  reader.readAsArrayBuffer(file)
  return result
}

function loadUrlSource (url, channel) {
  var oReq = new XMLHttpRequest();
  var meta = {
    url,
    name: url.split('/').pop()
  }
  const result = new Promise((resolve, reject) => {
    oReq.onload = (response) => {
      context.decodeAudioData(response.target.response, (buffer) => {
        resolve(setSample(buffer, meta, channel))
      })
    }
    oReq.onerror = (err) => {
      console.log(err)
    }
    oReq.responseType = "arraybuffer";
    oReq.open("GET", url, true);
    oReq.send()
  })
  return result
}

const mixer = {
  context,
  channels: {
    master: createMasterChannel(8)
  },
  loadFileSource,
  loadUrlSource,
  createChannel,
  toggleChannelMute,
  setChannelVolume,
  setChannelPan
}

export default mixer
