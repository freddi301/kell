// @flow

import { expect } from 'chai';
import { rule, rules, atom, record, bodyRecord, patternRecord, capture, release, s } from '../src';

describe('text parser', () => {
  it('works', () => {
    expect(s`
      a = b;
      @a = #a;
      { a: b } = c;
    `).to.deep.equal(rules([
      rule(atom('a'), atom('b')),
      rule(capture('a'), release('a')),
      rule(record([[atom('a'), atom('b')]]), atom('c'))
    ]));
  });
});


