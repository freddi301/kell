// @flow

import React from 'react';
import { PatternRecord } from '../'
import type { Interpret } from './GuiInterpreter';

export const PatternRecordC = ({ interpret, record }: { interpret: Interpret, record: PatternRecord }) => <span>
  {"{"} {Array.from(record.struct.entries()).map(([key, value]) => <span key={String(key)}>{interpret({ ast: key })}: {interpret({ ast: value })} </span>)} {"}"}
</span>