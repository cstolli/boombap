/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-24T19:42:15-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-24T19:42:30-07:00
* @License: MIT
*/

/* jshint expr:true */
import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'main-chassis',
  'Integration: MainChassisComponent',
  {
    integration: true
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#main-chassis}}
      //     template content
      //   {{/main-chassis}}
      // `);

      this.render(hbs`{{main-chassis}}`)
      expect(this.$()).to.have.length(1)
    })
  }
)
