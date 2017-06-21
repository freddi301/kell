// @flow

import { expect } from 'chai';
import { rule, rules, atom, record, bodyRecord, patternRecord, capture, release } from '../src';

describe('kell', () => {
  it('pretty prints', () => {
    const program = rules([
      rule(atom('true'), atom('true')),
      rule(capture('hello'), release('hello')),
      rule(patternRecord([[atom('a'), capture('b')], [capture('a'), atom('c')]]), bodyRecord([[release('b'), release('a')]])),
    ]);
    // console.dir(program, { depth: null, colors: true });
    // console.log(program.toString());
  });
  describe('unbound releases check', () => {
    it('works', () => {
      rule(capture('a'), release('a'));
      expect(() => rule(capture('a'), release('b'))).to.throw;
      rule(patternRecord([[atom('a'), capture('b')], [capture('a'), atom('c')]]), bodyRecord([[release('b'), release('a')]]));
      expect(() => rule(patternRecord([[atom('a'), capture('b')], [capture('a'), atom('c')]]), bodyRecord([[release('c'), release('d')]]))).to.throw;
    });
  });
  describe('subrec', () => {
    it('does non capture replace', () => {
      const program = rules([
        rule(atom('nocapturereplace'), atom('replaced'))
      ]);
      expect(program.subrec(atom('nocapturereplace'))).to.deep.equal(atom('replaced'));
    });
    it('does simple capture replace', () => {
      const program = rules([
        rule(capture('x'), release('x'))
      ])
      expect(program.subrec(atom('identity'))).to.deep.equal(atom('identity'));
    });
  });
});
