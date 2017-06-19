// @flow

import React from 'react';
import { Atom, Record, Capture, Release, PatternRecord, BodyRecord, Rule, Rules } from '../';
import type { PatternTerm, BodyTerm } from '../';

import { AtomC, RecordC, CaptureC, ReleaseC, PatternRecordC, BodyRecordC, RuleC, RulesC } from './';

export type Ast = Atom | Record | Capture | Release | PatternRecord | BodyRecord | Rule | Rules;

export type Interpret = ({ ast: Ast }) => ?React.Element<*>;

export const GuiInterpreter: Interpret = ({ ast }: { ast: Ast }) => {
  if (ast instanceof Atom) return AtomC({ atom: ast });
  else if (ast instanceof Record) return RecordC({ interpret: GuiInterpreter, record: ast });
  else if (ast instanceof Capture) return CaptureC({ capture: ast });
  else if (ast instanceof Release) return ReleaseC({ release: ast });
  else if (ast instanceof PatternRecord) return PatternRecordC({ interpret: GuiInterpreter, record: ast });
  else if (ast instanceof BodyRecord) return BodyRecordC({ interpret: GuiInterpreter, record: ast });
  else if (ast instanceof Rule) return RuleC({ interpret: GuiInterpreter, rule: ast });
  else if (ast instanceof Rules) return RulesC({ interpret: GuiInterpreter, rules: ast });
  throw new Error('invalid ast');
}