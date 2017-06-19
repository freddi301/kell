// @flow

import React from 'react';
import { Record } from '../'
import type { Interpret } from './GuiInterpreter';

export const RecordC = ({ interpret, record }: { interpret: Interpret, record: Record }) => <span>
  {"{"} {Array.from(record.struct.entries()).map(([key, value]) => <span key={String(key)}>{interpret({ ast: key })}: {interpret({ ast: value })} </span>)} {"}"}
</span>