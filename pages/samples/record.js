// @flow

import { atom, record } from '../../src';
import { GuiInterpreter } from '../../src/components/GuiInterpreter';

export default () => (
  <div>
    {GuiInterpreter({ ast: record([[atom('hello'), atom('tchao')]]) })}
  </div>
)