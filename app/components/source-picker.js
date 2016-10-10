import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['source-picker'],
  actions: {
    onMenuClick (event) {
      this.$('input').click()
      event.stopPropagation()
      event.preventDefault()
      return false
    },
    onFileSelection (event) {
      const file = event.target.files[0]
      this.sendAction('onSelectSource', file)
    }
  }
});
