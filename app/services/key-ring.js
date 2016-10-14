import Ember from 'ember'

const keys = [
  {number: 32,  key: ' ',        action: 'onSpacebar'},
  {number: 38,  key: 'ArrowUp',  action: 'onUpArrow'},
  {number: 40,  key: 'ArrowDown',  action: 'onDownArrow'},
  {number: 77,  key: 'm',  action: 'onLetterM'}
]

export default Ember.Service.extend({
  listeners: {},
  init () {
    this._super(...arguments)
  },
  listen (component, selector, exceptions) {
    if (this.get('listeners')[component.toString()]) return
    this.get('listeners')[component.toString()] = {
      component,
      selector,
      exceptions
    }
    Ember.$(selector || component.$()).on('keypress keyup keydown', this.handleKey.bind(this))
  },
  stopListening (component) {
    let listener = this.get('listeners')[component.toString()]
    Ember.$(listener.selector || listener.component.$()).off('keypress keyup keydown')
    delete this.get('listeners')[component.toString()]
  },
  getModifiers (keyEvent) {
    const modifierKeys = [
      'metaKey',
      'shiftKey',
      'ctrlKey',
      'altKey'
    ]
    return modifierKeys.reduce((modifiers, key) => {
      modifiers[key.replace('Key', '')] = keyEvent[key]
      return modifiers
    }, {})
  },
  getAction (which) {
    const key = keys.find((key) => key.number === which)
    if (!key) return
    return key.action
  },
  handleKey (keyEvent) {
    if (!keyEvent) return
    const type = keyEvent.type
    const which = keyEvent.which
    const action = this.getAction(which)
    const modifiers = this.getModifiers(keyEvent)
    if (!action) return

    Object.keys(this.get('listeners')).map((key) => {
      const listener = this.get('listeners')[key].component
      const exceptions = this.get('listeners')[key].exceptions
      if (!listener.actions[action]) return
      if ($(keyEvent.originalEvent.target).is(exceptions)) return
      const result = listener.actions[action].call(listener, type, modifiers)
      if (result === null) {
        keyEvent.preventDefault()
        keyEvent.stopPropagation()
        keyEvent.stopImmediatePropagation()
        return false
      }
      if (result === false) {
        keyEvent.preventDefault()
        return false
      }
      if (result === true) {
        keyEvent.stopPropagation()
      }
    })
  }
});
