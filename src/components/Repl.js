// @flow

import React from 'react';
import { GuiInterpreter } from '../components/GuiInterpreter';
import { s } from '../'

export class Repl extends React.Component {
  state = { rules: "", input: "", output: null };
  render() {
    const { rules, input, output } = this.state;
    <div>
      rules<br/>
      <textarea value={rules} onChange={this.setRules}/>
      input<br />
      <textarea value={input} onChange={this.setInput}/>
      output<br />
      {output ? GuiInterpreter({ ast: output }) : null}
    </div>
  }
  setRules = e => this.setState({ rules: e.target.value });
  setInput = e => this.setState({ input: e.target.value });
  setOutput = output => this.setState({ output });
}