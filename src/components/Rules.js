// @flow

import React from 'react';
import { Rules } from '../'
import type { Interpret } from './GuiInterpreter';

export const RulesC = ({ interpret, rules }: { rules: Rules, interpret: Interpret }) => <div>
  {rules.rules.map(rule => <span key={String(rule)}>{interpret({ ast: rule })};<br/></span>)}
</div>