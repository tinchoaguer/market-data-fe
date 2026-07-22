/**
 * en / ui templates for v1 Content codes.
 * Placeholder syntax: `{paramName}` — see design.md Copy / Wording.
 */
export const enUiTemplates: Readonly<Record<string, string>> = Object.freeze({
  // Analysis
  'catalog.wait': 'Catalog waiting — gated by {gate}.',
  'catalog.strategy_allowed':
    'Strategy {strategy} is allowed for regime {regime}.',
  'catalog.no_strategy_allowed':
    'No strategy is allowed for regime {regime}.',
  'catalog.hard_gate.extreme_regime': 'Hard gate: extreme regime {regime}.',
  'catalog.hard_gate.risk_too_high':
    'Hard gate: risk score {risk_score} is too high.',
  'catalog.hard_gate.negative_edge':
    'Hard gate: economic edge {edge} is negative.',
  'catalog.hard_gate.no_capacity':
    'Hard gate: insufficient allocation capacity.',

  // Classification — regime
  trend_up: 'Trend up',
  trend_down: 'Trend down',
  range: 'Range',
  chaotic: 'Chaotic',
  news_spike: 'News spike',

  // Classification — risk
  low_risk: 'Low risk',
  moderate_risk: 'Moderate risk',
  elevated_risk: 'Elevated risk',
  high_risk: 'High risk',

  // Classification — economic
  strong_edge: 'Strong edge',
  moderate_edge: 'Moderate edge',
  neutral_edge: 'Neutral edge',
  negative_edge: 'Negative edge',

  // Classification — exposure
  ample_capacity: 'Ample capacity',
  limited_capacity: 'Limited capacity',
  constrained_capacity: 'Constrained capacity',
})
