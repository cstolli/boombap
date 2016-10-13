import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['main-chassis'],
  attributeBindings: ['style'],
  selectedChannel: 0,
  tempo: 80,
  division: 16,
  soundly: Ember.inject.service('soundly'),
  style: Ember.computed('height', function () {
    return `height: ${this.get('height')}px;`
  }),
  sequencerDivisions: Array.apply(null, {length: 16}).map((division, index) => {
    return {'division': index}
  }),
  actions: {
    selectChannel (value) {
      this.set('selectedChannel', value)
    },
    soloChannel (channelNumber) {
      const soloed = this.get('soundly').toggleChannelSolo(channelNumber)
      const channel = this.get('channels').findBy('number', channelNumber)
      Ember.set(channel, 'solo', soloed)
    },
    muteChannel (channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber)
      const muted = this.get('soundly').toggleChannelMute(channelNumber)
      Ember.set(channel, 'mute', muted)
    },
    channelVolume (value, channelNumber) {
      this.get('soundly').setChannelVolume(channelNumber, value)
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      Ember.set(channel, 'gain', value)
    },
    triggerSource (channelNumber) {
      this.triggerChannel(channelNumber)
    },
    panChannel (value, channelNumber) {
      this.get('soundly').setChannelPan(channelNumber, value)
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      Ember.set(channel, 'pan', value)
    },
    selectSource (file, channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber)
      this.get('soundly').loadFileSource(file, channelNumber)
        .then((sound) => {
          Ember.set(channel, 'input', sound)
          Ember.set(channel, 'sourceLabel', file.name)
        })
    }
  },
  setSoloChannel (value) {
    const channel = this.get('channels').findBy('number', value)
    Ember.set(channel, 'solo', !channel.solo)
  },
  setMutedChannel (value) {
    const channel = this.get('channels').findBy('number', value)
    Ember.set(channel, 'mute', !channel.mute)
  },
  triggerChannel(channelNumber) {
    const channel = this.get('channels').findBy('number', channelNumber)
    Ember.set(channel, 'triggered', true)
    channel.input.trigger(channelNumber)
      .then(() => {
        Ember.set(channel, 'triggered', false)
      })
      .catch(() => {
        Ember.set(channel, 'triggered', false)
      })
  },
  keyPress (event) {
    switch (event.which) {
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.triggerChannel(event.which + 2 - 50)
        break;
    }
  }
});
