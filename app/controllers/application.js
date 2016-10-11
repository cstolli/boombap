import Ember from 'ember';

const channels = [
  {'number': 1, 'label': '1', pan: 0, 'mute': false, 'solo': false, 'gain': 0.8, input: {}},
  {'number': 2, 'label': '2', pan: -.3, 'mute': false, 'solo': false, 'gain': 0.6, input: {}},
  {'number': 3, 'label': '3', pan: .3, 'mute': false, 'solo': false, 'gain': 0.5, input: {}},
  {'number': 4, 'label': '4', pan: .1, 'mute': false, 'solo': false, 'gain': 0.5, input: {}},
  {'number': 5, 'label': '5', pan: -.1, 'mute': false, 'solo': false, 'gain': 0.6, input: {}},
  {'number': 6, 'label': '6', pan: -.5, 'mute': false, 'solo': false, 'gain': 0.8, input: {}},
  {'number': 7, 'label': '7', pan: 0, 'mute': false, 'solo': false, 'gain': 0.8, input: {}},
  {'number': 8, 'label': '8', pan: .5, 'mute': false, 'solo': false, 'gain': 0.8, input: {}}
]

const masterChannel = {number: 'master', pan: 0, 'label': 'Master', 'mute': false, gain: 0.8, input: null}

export default Ember.Controller.extend({
  soundly: Ember.inject.service(),
  ajax: Ember.inject.service(),
  context: Ember.computed('soundly', function () {
    return this.get('soundly').context
  }),
  channels,
  masterChannel,
  init () {
    this._super(...arguments)
    const soundly = this.get('soundly')
    const master = soundly.channels.master
    this.get('channels').map((channel) => {
      channel.input = soundly.createChannel(channel.label, channel)
      soundly.channels[channel.number] = channel.input
    })
    this.loadDefaultSoundBank()
    this.set('masterChannel.input', master)
  },
  loadDefaultSoundBank() {
    const channels = this.get('channels')
    const defaultBank = 'sounds/drums'
    this.get('ajax').request(`${defaultBank}/bank.json`)
      .then((bank) => {
        channels.map((channel) => {
          const url = `/${defaultBank}/${bank.sounds[channel.number]}`
          this.get('soundly').loadUrlSource(url, channel.number)
            .then(() => {
              Ember.run.later(() => {
                Ember.set(channel, 'sourceLabel', channel.input.sampleMeta.name)
              })
            })
        })
      })
  }
});
