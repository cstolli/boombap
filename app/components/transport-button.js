import Ember from 'ember'

export default Ember.Component.extend({
  classNames: ['transport-button'],
  click () {
    this.get('togglePlay')()
  }
})
