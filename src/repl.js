// @flow

import repl from 'repl';

import * as k from './';

const replServer = repl.start({
  prompt: "λ ",
});

Object.assign(replServer.context, k);

import fs from 'fs';

const file = path => k.parse(fs.readFileSync(path, 'utf-8'));

replServer.context.file = file;