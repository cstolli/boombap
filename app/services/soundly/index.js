const context = new window.AudioContext()
import Ember from 'ember'
const Promise = Ember.RSVP.Promise
import _ from 'lodash'

function trigger(number) {
  const channel = getChannel(number)
  const source = context.createBufferSource()
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

function getChannel(channelNumber) {
  return mixer.channels[channelNumber]
}

function setSample(sample, meta, channelNumber) {
  getChannel(channelNumber).sample = sample
  getChannel(channelNumber).sampleMeta = meta
  return getChannel(channelNumber)
}

function createChannel (label, options = {}) {

  if (!options.number) {
    throw('A channel must have a number')
  }
  const panner = context.createStereoPanner()
  const splitter = context.createChannelSplitter()
  const gain = context.createGain()
  const output = context.createGain()
  const analyser = context.createAnalyser()

  panner.pan.value = options.pan || 0
  gain.gain.value = options.gain || 0
  output.gain.value = 1

  gain.connect(panner)
  panner.connect(output)
  output.connect(analyser)
  analyser.connect(splitter)
  splitter.connect(getChannel('master').source, 0, 0)
  splitter.connect(getChannel('master').source, 1, 1)
  const channel = {
    label: label || options.label || '',
    number: options.number,
    source: gain,
    mute: options.mute || false,
    solo: options.solo || false,
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
  const muteChannel = getChannel(channelNumber)
  const outputGain = muteChannel.output.gain
  muteChannel.mute = !muteChannel.mute
  outputGain.value = outputGain.value === 1 ? 0 : 1
  return muteChannel.mute
}

function getChannels() {
  return _.reject(mixer.channels, {label: 'master'})
}

//TODO: Find the better algorithm here
function toggleChannelSolo(channelNumber) {
  const soloChannel = getChannel(channelNumber)
  soloChannel.solo = !soloChannel.solo
  soloChannel.output.gain.value = soloChannel.solo ? 1 : 0

  const soloed = _.map(getChannels(), (channel) => {
    if (
        channel.output.gain.value === 0 ||
        channel.solo
      ) {
      return channel.solo
    }
    channel.output.gain.value = 1 - channel.output.gain.value
    return channel.solo
  })

  if (_.filter(soloed, (item) => item).length === 0) {
    _.map(mixer.channels, (channel) => {
      if (channel.label === 'master' || channel.mute) {
        return
      }
      channel.output.gain.value = 1
    })
  }
  return soloChannel.solo
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
  setChannelPan,
  toggleChannelSolo
}

export default mixer
