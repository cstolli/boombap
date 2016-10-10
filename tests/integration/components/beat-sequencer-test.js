import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('beat-sequencer', 'Integration | Component | beat sequencer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{beat-sequencer}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#beat-sequencer}}
      template block text
    {{/beat-sequencer}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
