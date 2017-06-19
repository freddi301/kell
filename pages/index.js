// @flow

import { AtomC } from '../src/components/Atom';
import { Atom } from '../src';

export default () => (
  <div>
    <h1>Welcome to next.js!</h1>
    {AtomC(new Atom('hello'))}
  </div>
)