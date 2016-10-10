import Ember from 'ember';

const channels = [
  {'number': 1, 'label': '1', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 2, 'label': '2', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 3, 'label': '3', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 4, 'label': '4', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 5, 'label': '5', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 6, 'label': '6', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 7, 'label': '7', 'mute': false, 'solo': false, 'volume': 0, input: {}},
  {'number': 8, 'label': '8', 'mute': false, 'solo': false, 'volume': 0, input: {}}
]

const masterChannel = {number: 9, 'label': 'Master', input: null}

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
        })
      })
  }
});
