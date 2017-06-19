// @flow

import React from 'react';
import { BodyRecord } from '../'
import type { Interpret } from './GuiInterpreter';

export const BodyRecordC = ({ interpret, record }: { interpret: Interpret, record: BodyRecord }) => <span>
  {"{"} {Array.from(record.struct.entries()).map(([key, value]) => <span key={String(key)}>{interpret({ ast: key })}: {interpret({ ast: value })} </span>)} {"}"}
</span>