// @flow

import React from 'react';
import { Rule } from '../'
import type { Interpret } from './GuiInterpreter';

export const RuleC = ({ interpret, rule }: { rule: Rule, interpret: Interpret }) => <span>{interpret({ ast: rule.pattern })} → {interpret({ ast: rule.body })}</span>