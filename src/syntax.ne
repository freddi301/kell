export default `
@builtin "whitespace.ne"

@{%
  const { atom, capture, release, rules, rule, patternRecord, bodyRecord } = require('./index.js');
%}

MAIN ->
  _ RULES _ {% d => d[1] %}
| _ LEAF _ {% d => d[1] %}

RULES ->
  RULES _ RULE {% d => d[0].add(d[2]) %}
| RULE {% d => rules([d[0]]) %}

RULE ->
  PATTERN_LEAF _ "→" _ BODY_LEAF _ ";" {% d => rule(d[0], d[4]) %}

PATTERN_LEAF ->
  ATOM {% d => d[0] %}
| CAPTURE {% d => d[0] %}
| PATTERN_RECORD {% d => d[0] %}

BODY_LEAF ->
  ATOM {% d => d[0] %}
| RELEASE {% d => d[0] %}
| BODY_RECORD {% d => d[0] %}

PATTERN_RECORD ->
  "{" _ PATTERN_RECORD_LEAF _ "}" {% d => patternRecord([d[2]]) %}
| "{" _ PATTERN_RECORD_PAIR _ "}" {% d => patternRecord(d[2]) %}

PATTERN_RECORD_PAIR ->
  PATTERN_RECORD_LEAF _ "," _ PATTERN_RECORD_LEAF {% d => [d[0], d[4]] %}
| PATTERN_RECORD_PAIR _ "," _ PATTERN_RECORD_LEAF {% d => d[0].concat(d[4]) %}

PATTERN_RECORD_LEAF ->
  PATTERN_LEAF _ ":" _ PATTERN_LEAF {% d => [d[0], d[4]] %}

BODY_RECORD ->
  "{" _ BODY_RECORD_LEAF _ "}" {% d => bodyRecord([d[2]]) %}
| "{" _ BODY_RECORD_PAIR _ "}" {% d => bodyRecord(d[2]) %}

BODY_RECORD_PAIR ->
  BODY_RECORD_LEAF _ "," _ BODY_RECORD_LEAF {% d => [d[0], d[4]] %}
| BODY_RECORD_PAIR _ "," _ BODY_RECORD_LEAF {% d => d[0].concat(d[4]) %}

BODY_RECORD_LEAF ->
  BODY_LEAF _ ":" _ BODY_LEAF {% d => [d[0], d[4]] %}

LEAF ->
  ATOM {% d => d[0] %}
| RECORD {% d => d[0] %}

RECORD ->
  "{" _ RECORD_LEAF _ "}" {% d => record([d[2]]) %}
| "{" _ RECORD_PAIR _ "}" {% d => record(d[2]) %}

RECORD_PAIR ->
  RECORD_LEAF _ "," _ RECORD_LEAF {% d => [d[0], d[4]] %}
| RECORD_PAIR _ "," _ RECORD_LEAF {% d => d[0].concat(d[4]) %}

RECORD_LEAF ->
  LEAF _ ":" _ LEAF {% d => [d[0], d[4]] %}

CAPTURE ->
  "©" QUALIFIER {% d => capture(d[1]) %}

RELEASE ->
  "®" QUALIFIER {% d => release(d[1]) %}

ATOM ->
  QUALIFIER {% d => atom(d[0]) %}

QUALIFIER ->
  [^\\s\\n,:;{}®©]:+ {% d => d[0].join('') %}
`;