// @flow

import React from 'react';
import { Release } from '../'

export const ReleaseC = ({ release }: { release: Release }) => <span>®{release.name}</span>