/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T16:13:29-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-17T00:00:43-07:00
* @License: MIT
*/

import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import {
  beforeEach
} from 'mocha'

import hbs from 'htmlbars-inline-precompile'

import patternA from 'boombap/assets/patterns/pattern-a'

describeComponent(
  'beat-sequencer',
  'Integration: BeatSequencerComponent',
  {
    integration: true
  },
  function () {
    let props, args
    beforeEach(function () {
      args = null
      props = {
        timeSignature: {
          numerator: 4,
          denominator: 4
        },
        playingDivision: 1,
        pattern: patternA.kick,
        selectedChannel: 1,
        onChangeStub: function () {
          args = arguments
        }
      }

      this.setProperties(props)
      this.render(hbs`{{beat-sequencer
        playingDivision=playingDivision
        pattern=pattern
        selectedChannel=selectedChannel
        onChange=onChangeStub
      }}`)
    })

    it('renders', function () {
      expect(this.$()).to.have.length(1)
    })

    it('has correct division lit up', function () {
      expect(
        this.$('.beat-sequencer-slot').first().hasClass('playing')
      ).to.be.ok
    })

    it('has the correct pattern lit up', function () {
      Object.keys(props.pattern).map((position) => {
        expect(this.$('.beat-sequencer-slot').eq(parseInt(position, 10) - 1).hasClass('active'))
          .to.equal(props.pattern[position].active)
      })
    })

    it('has the correctly numbered buttons', function () {
      Object.keys(props.pattern).map((position) => {
        expect(this.$('.beat-sequencer-slot').eq(parseInt(position, 10) - 1).text().trim())
          .to.equal(position)
      })
    })

    it('calls a callback when it receives a change', function () {
      this.$('.beat-sequencer-slot').eq(2).click()
      expect(args[0]).to.eql(3)
      expect(args[1]).to.eql(1)
    })
  }
)
