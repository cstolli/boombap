import resolver from './helpers/resolver'
import { setResolver, setupTest } from 'ember-mocha'
import { describe, it } from 'mocha'
import { expect } from 'chai'

setResolver(resolver)

// Replace this with your real tests.
describe('soundly :', function (assert) {
  setupTest('service:soundly', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  })

  let service = this.subject()
  assert.ok(service)

  it('exists', function () {
    expect(service).to.be.ok
  })
})
