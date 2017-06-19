// @flow

import { atom, rules, rule, capture, release, record } from '../../src';
import { GuiInterpreter } from '../../src/components/GuiInterpreter';

export default () => (
  <div>
    {GuiInterpreter({ ast: rules([
      rule(atom('a'), atom('b')),
      rule(capture('a'), release('a')),
      rule(record([[atom('a'), atom('b')]]), atom('c'))
    ]) })}
  </div>
)