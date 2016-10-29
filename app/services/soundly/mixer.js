/**
*            _
*  _ __ ___ (_)_  _____ _ __
* | '_ ` _ \| \ \/ / _ \ '__|
* | | | | | | |>  <  __/ |
* |_| |_| |_|_/_/\_\___|_|
*
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-16T18:25:20-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-28T22:55:06-07:00
* @License: MIT
*/

import _ from 'lodash'

import Channel from './channel'
import utils from './utils'

function getChannel (channelNumber) {
  return mixer.channels[channelNumber]
}

function getChannelAnalyser (channelNumber) {
  return mixer.channels[channelNumber].analyser
}

function getChannels () {
  return _.reject(mixer.channels, {label: 'master'})
}

function getMasterChannel (mixer) {
  return mixer.channels['master']
}

function setChannelPan (channelNumber, value) {
  getChannel(channelNumber).panner.pan.value = value
}

function setChannelVolume (channelNumber, value) {
  getChannel(channelNumber).gain.gain.value = utils.decibelsToGain(value)
}

function toggleChannelMute (channelNumber) {
  const muteChannel = getChannel(channelNumber)
  const outputGain = muteChannel.output.gain
  muteChannel.mute = !muteChannel.mute
  outputGain.value = outputGain.value === 1 ? 0 : 1
  return muteChannel.mute
}

function setChannelEq (channelNumber, bandNumber, attr, value) {
  const eq = getChannel(channelNumber).equalizer
  const band = eq.bands[bandNumber - 1]
  if (!band[attr]) {
    throw new Error(`There is no ${attr} attribute of an eq band, discarding.`)
  }
  if (attr === 'type') {
    band.type = value
    return
  }
  band[attr].value = value
}
// TODO: Find the better algorithm here
function toggleChannelSolo (channelNumber) {
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

function addChannel (number, options = {}) {
  if (!number) {
    throw new Error('A new channel requires a number')
  }
  const dest = mixer.channels.master.source
  mixer.channels[number] = Channel.createChannel(mixer.context, dest, options)
  return mixer.channels[number]
}

function removeChannel (number, options = {}) {
  delete mixer.channels[number]
}

const mixer = {
  context: null,
  addChannel,
  channels: {},
  getChannel,
  getChannels,
  getChannelAnalyser,
  getMasterChannel,
  removeChannel,
  toggleChannelMute,
  toggleChannelSolo,
  setChannelEq,
  setChannelVolume,
  setChannelPan
}

export default mixer
