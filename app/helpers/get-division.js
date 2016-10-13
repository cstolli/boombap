import Ember from 'ember';

export function getDivision([pattern, beat, division]) {
  return pattern[beat][division]
}

export default Ember.Helper.helper(getDivision);
