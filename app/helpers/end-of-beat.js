import Ember from 'ember';

export function endOfBeat([division]) {
  return division.division === 4 && !(division.beat === 4)
}

export default Ember.Helper.helper(endOfBeat);
