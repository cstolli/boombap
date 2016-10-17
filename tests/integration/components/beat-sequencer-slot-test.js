import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('beat-sequencer-slot', 'Integration | Component | beat sequencer slot', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{beat-sequencer-slot}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#beat-sequencer-slot}}
      template block text
    {{/beat-sequencer-slot}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
