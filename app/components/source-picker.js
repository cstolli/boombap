import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['source-picker'],
  label: Ember.computed('output', function () {
    return this.get('output.input.sampleMeta.name')
  }),
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
