// @flow

import { expect } from 'chai';
import { isEqual } from 'lodash';

export class Atom {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  matches(term: Term): ?Map<string, Term> { if (term instanceof Atom && term.name === this.name) return new Map; }
  release(scope: Map<string, Term>): Term { return this; }
  toString(): string { return this.name; }
}
export const atom = (name: string): Atom => new Atom(name);

export class Record {
  struct: Map<Term, Term> = new Map;
  constructor(struct: Map<Term, Term>) {
    this.struct = struct;
  }
  matches(term: Term): ?Map<string, Term> {
    if (term instanceof Record) {
      if (this.struct.size != term.struct.size) return;
      const thisEntries = Array.from(this.struct.entries());
      const termEntries = Array.from(term.struct.entries());
      for (const [thisKey, thisValue] of thisEntries) {
        let found;
        for (const [termKey, termValue] of termEntries) {
          if (thisKey.matches(termKey) && thisValue.matches(termValue)) { found = true; break; }
        }
        if (!found) return;
      }
      return new Map;
    }
  }
  release(scope: Map<string, Term>): Term { return this; }
  toString() {
    const pairs = [];
    for (const [key, value] of this.struct.entries()) pairs.push(`${key.toString()}: ${value.toString()}`);
    return `{ ${pairs.join(', ')} }`;
  }
}
export const record = (struct: Array<[Term, Term]>) => new Record(new Map(struct));

export type Term = Atom | Record;

export class Capture {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  matches(term: Term): Map<string, Term> { return new Map([[this.name, term]]); }
  toString() { return `@${this.name}`; }
}
export const capture = (name: string) => new Capture(name);

export class Release {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  release(scope: Map<string, Term>): Term {
    const term = scope.get(this.name);
    if (term) return term;
    throw new Error('release not in scope');
  }
  toString() { return `#${this.name}`; }
}
export const release = (name: string) => new Release(name);

export class PatternRecord {
  struct: Map<PatternTerm, PatternTerm> = new Map;
  constructor(struct: Map<PatternTerm, PatternTerm>) {
    this.struct = struct;
  }
  matches(term: Term): ?Map<string, Term> {
    if (term instanceof Record) {
      if (this.struct.size != term.struct.size) return;
      const thisEntries = Array.from(this.struct.entries());
      const termEntries = Array.from(term.struct.entries());
      const scope: Map<string, Term> = new Map;
      for (const [thisKey, thisValue] of thisEntries) {
        let found;
        for (const [termKey, termValue] of termEntries) {
          const keyMatch = thisKey.matches(termKey);
          const valueMatch = thisValue.matches(termValue);
          if (keyMatch && valueMatch) {
            found = true;
            for (const [k, v] of keyMatch.entries()) { scope.set(k, v); }
            for (const [k, v] of valueMatch.entries()) { scope.set(k, v); }
            break;
          }
        }
        if (!found) return;
      }
      return scope;
    }
  }
  toString() {
    const pairs = [];
    for (const [key, value] of this.struct.entries()) pairs.push(`${key.toString()}: ${value.toString()}`);
    return `{ ${pairs.join(', ')} }`;
  }
}
export const patternRecord = (struct: Array<[PatternTerm, PatternTerm]>) => new PatternRecord(new Map(struct));

export type PatternTerm = Atom | Record | Capture | PatternRecord;

export class BodyRecord {
  struct: Map<BodyTerm, BodyTerm> = new Map;
  constructor(struct: Map<BodyTerm, BodyTerm>) {
    this.struct = struct;
  }
  release(scope: Map<string, Term>) {
    return record(Array.from(this.struct.entries()).map(([key, value]) => [key.release(scope), value.release(scope)]));
  }
  toString() {
    const pairs = [];
    for (const [key, value] of this.struct.entries()) pairs.push(`${key.toString()}: ${value.toString()}`);
    return `{ ${pairs.join(', ')} }`;
  }
}
export const bodyRecord = (struct: Array<[BodyTerm, BodyTerm]>) => new BodyRecord(new Map(struct));

export type BodyTerm = Atom | Record | Release | BodyRecord;

export class Rule {
  pattern: PatternTerm;
  body: BodyTerm;
  params: Map<string, Capture>;
  constructor(pattern: PatternTerm, body: BodyTerm) {
    this.pattern = pattern;
    this.body = body;
    Rule.checkUnboundReleases(pattern, body);
  }
  toString() {
    return `${this.pattern.toString()} = ${this.body.toString()}`
  }
  static checkUnboundReleases(pattern: PatternTerm, body: BodyTerm) {
    const params: Set<string> = new Set;
    const visitPattern = term => {
      if (term instanceof Capture) params.add(term.name);
      else if (term instanceof PatternRecord) for (const [key, value] of term.struct.entries()) { visitPattern(key); visitPattern(value); }
    };
    visitPattern(pattern);
    const unboundReleases: Set<Release> = new Set;
    const visitBody = term => {
      if (term instanceof Release && !params.has(term.name)) unboundReleases.add(term);
      else if (term instanceof BodyRecord) for (const [key, value] of term.struct.entries()) { visitBody(key); visitBody(value); } 
    }
    visitBody(body);
    if (unboundReleases.size) throw new UnbounfReleasesError(unboundReleases);
  }
}
export const rule = (pattern: PatternTerm, body: BodyTerm) => new Rule(pattern, body);

export class Rules {
  rules: Array<Rule>;
  constructor(rules: Array<Rule>) {
    this.rules = rules;
  }
  match(term: Term): ?{ scope: Map<string, Term>, rule: Rule } {
    for (const rule of this.rules) {
      const matched = rule.pattern.matches(term);
      if (matched) return { scope: matched, rule };
    }
  }
  subrec(term: Term, scope: Map<string, Term> = new Map): Term {
    let subbing: Term = term;
    while (true) {
      const matched = this.match(subbing);
      if (matched) {
        const subbed = matched.rule.body.release(matched.scope);
        if (isEqual(subbing, subbed)) return subbing;
        subbing = subbed;
      } else if (subbing instanceof Record) {
        const subbed = record(Array.from(subbing.struct.entries()).map(([key, value]) => [this.subrec(key, scope), this.subrec(value, scope)]));
        if (isEqual(subbing, subbed)) return subbing;
        subbing = subbed;
      } else return subbing;
    }
    return subbing;
  }
  add(rule: Rule): Rules {
    return new Rules(this.rules.concat([rule]));
  }
  toString() {
    return this.rules.map(rule => rule.toString()).join(';\n');
  }
}
export const rules = (rules: Array<Rule>) => new Rules(rules);

export class UnbounfReleasesError extends Error {
  releases: Set<Release>;
  constructor(releases: Set<Release>) {
    super('unbound releases');
    this.releases = releases;
  }
}

import nearleyMake from "nearley-make";
import fs from 'fs';
const grammar = fs.readFileSync('src/syntax.ne', 'utf-8');
export function parse(text: string): Term | Rules {
  const parser = nearleyMake(grammar, { require });
  parser.feed(text);
  if (parser.results.length === 0) throw new Error('unecpected end of input');
  if (parser.results.length > 1) { console.dir(parser.results, { colors: true, depth: null }); throw new Error('ambigous syntax'); }
  return parser.results[0];
}
export const s = (template: string[], ...expressions: string[]) => parse(template.reduce((accumulator, part, i) => accumulator + expressions[i - 1] + part));