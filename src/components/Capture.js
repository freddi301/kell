// @flow

import React from 'react';
import { Capture } from '../'

export const CaptureC = ({ capture }: { capture: Capture }) => <span>©{capture.name}</span>