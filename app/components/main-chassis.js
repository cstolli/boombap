import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['main-chassis'],
  attributeBindings: ['style'],
  selectedChannel: 1,
  tempo: 80,
  divisions: 16,
  patterns: {},
  timeSignature: {numberator: 4, denominator: 4},
  playingDivision: 0,
  playing: false,
  soundly: Ember.inject.service('soundly'),
  keyRing: Ember.inject.service('keyRing'),
  style: Ember.computed('height', function () {
    return `height: ${this.get('height')}px;`
  }),
  init () {
    this._super(...arguments)
  },
  didRender () {
    // this.get('keyRing').listen(this)
  },
  runAnimationLoop() {
    let then = window.performance.now()
    const startTime = then
    let now, elapsed, currentInterval = 1

    const loop = () => {
      const bps = this.get('tempo') / 60 // turn BPM into BPS
      const bpsInterval = 1000 / (bps * 4)

      if (this.get('playing')) {
        requestAnimationFrame(loop)
      } else {
        this.set('playingDivision', 0)
      }

      now = window.performance.now();
      elapsed = now - then;
      if (elapsed > bpsInterval || elapsed === 0) {
        this.sequence(currentInterval)
        currentInterval++
        if (currentInterval === this.get('divisions') + 1) {
          currentInterval = 1
        }
        then = now - (elapsed % bpsInterval);
      }
    }

    loop()
  },

  sequence(division){
    this.set('playingDivision', division)
    this.get('channels').map((channel) => {
      if (!channel.pattern) {
        return
      }
      if (channel.pattern[division].active) {
        this.triggerChannel(channel.number)
      }
    })
  },

  freshPattern () {
    const pattern = Ember.Object.create({})
    for (let x = 1; x <= this.get('divisions'); x++) {
      pattern.set(x + '', Ember.Object.create({
        beat: Math.ceil(x / 4),
        division: x % 4 || 4,
        active: false
      }))
    }
    return pattern
  },
  selectedPattern: Ember.computed('selectedChannel', 'channels.@each.pattern', function () {
    const channel = this.get('channels').findBy('number', this.get('selectedChannel') || 1)
    const pattern = channel.pattern || this.freshPattern()
    return pattern
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
    setPattern (division, channelNumber) {
      const channel = this.get('channels').findBy('number', channelNumber) || this.get('masterChannel')
      const pattern = channel.pattern || this.freshPattern()
      pattern[division].set('active', !pattern[division].get('active'))
      Ember.set(channel, 'pattern', pattern)
    },
    changeTempo (tempo) {
      this.set('tempo', parseInt(tempo, 10))
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
    },
    togglePlay () {
      this.set('playing', !this.get('playing'))
      if (this.get('playing')) {
        this.runAnimationLoop()
      }
    },
    onSpacebar (type, modifiers) {
      if (type === 'keypress') {
        this.actions.togglePlay.call(this)
        return null
      }
    },
    goBack () {

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
  }
});
