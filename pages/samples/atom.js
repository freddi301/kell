// @flow

import { atom } from '../../src';
import { GuiInterpreter } from '../../src/components/GuiInterpreter';

export default () => (
  <div>
    {GuiInterpreter({ ast: atom('hello') })}
  </div>
)