# Review Report: extend-human-readable-labels

```yaml
feature:
  slug: extend-human-readable-labels

decision: APPROVED

summary: >
  Locale-backed label catalogs and thin resolveLabel wrappers humanize classification
  reason codes, strategy tokens, exposure factor keys, and risk/economic component
  names in the mapping layer. Screens continue to bind view models only. Unknown
  codes fall back to raw strings without failing mapping. Tests cover catalogs,
  mappers, UI boundary, and idle/loading/error/retry flows. Existing analysis
  regime catalogs remain unchanged. Approve.

requirements:
  - id: REQ-001
    status: pass
    notes: >
      mapMarketClassificationPayload resolves regime signal reasons via
      getClassificationRegimeReasonLabel; mapper and screen tests assert catalog text
      (e.g. trend_up → "Trend up").
  - id: REQ-002
    status: pass
    notes: >
      Risk signal reasons resolved via getClassificationRiskReasonLabel; covered in
      mapMarketClassification.test.ts and MarketClassificationScreen.test.tsx.
  - id: REQ-003
    status: pass
    notes: >
      Economic signal reasons resolved via getClassificationEconomicReasonLabel;
      covered in mapper and screen tests.
  - id: REQ-004
    status: pass
    notes: >
      Exposure signal reasons resolved via getClassificationExposureReasonLabel;
      covered in mapper and screen tests.
  - id: REQ-005
    status: pass
    notes: >
      Backend preferred_strategy and design recommendation catalogId/name pass through
      getStrategyLabel; mapper and analysis screen tests assert TREND_FOLLOWING →
      "Trend following".
  - id: REQ-006
    status: pass
    notes: >
      Exposure factor keys humanized via getExposureFactorLabel in both backend
      (exposure.components) and design (factors[].name) paths; tests assert
      vol_budget_pct / liquidity_cap_value labels.
  - id: REQ-007
    status: pass
    notes: >
      formatComponentsSummary uses getRiskComponentLabel before name=weight join;
      backend mapper test asserts atr_expansion / liquidity_stress humanized summaries.
  - id: REQ-008
    status: pass
    notes: >
      formatComponentsSummary uses getEconomicComponentLabel; mapper and screen tests
      assert activity / cost_drag humanized summaries.
  - id: REQ-009
    status: pass
    notes: >
      Display English lives in src/locales/en.json; wrappers call resolveLabel;
      mapper source-read tests assert no hardcoded display phrases.
  - id: REQ-010
    status: pass
    notes: >
      Unknown classification reasons and unknown strategy/factor/component tokens fall
      back to raw codes without throwing; covered in both mapper test suites.
  - id: REQ-011
    status: pass
    notes: >
      Screen components do not import label helpers or embed DTO code maps; component
      source-scan tests enforce the view-model boundary.
  - id: REQ-012
    status: pass
    notes: >
      Idle/empty, loading, success, error/retry, and stale-response behavior retained
      in MarketClassificationScreen and MarketAnalysisScreen tests.
  - id: REQ-013
    status: pass
    notes: >
      Full RegimeReasonCode, RiskReasonCode, EconomicReasonCode, ExposureReasonCode
      locale entries present; match shared/openapi.json enums; completeness tests in
      labels.test.ts.
  - id: REQ-014
    status: pass
    notes: >
      All five StrategyType tokens catalogued under analysisLabels.strategy.*; tested
      via getStrategyLabel each-member cases.
  - id: REQ-015
    status: pass
    notes: >
      vol_budget_pct and liquidity_cap_value present under analysisLabels.exposureFactor.*;
      match OpenAPI ExposureComponentsResponse properties.
  - id: REQ-016
    status: pass
    notes: >
      Risk components (volatility, atr_expansion, regime, liquidity_stress) and economic
      components (microstructure, activity, range_economics, cost_drag) all catalogued
      and tested.
  - id: REQ-017
    status: pass
    notes: >
      New wrappers reuse resolveLabel with fixed prefixes; analysisLabels.regime.* and
      regimeReason.* catalogs/helpers unchanged.
  - id: NFR-001
    status: pass
    notes: FE-only mapping; reviewed artifacts are frontend sources only.
  - id: NFR-002
    status: pass
    notes: Closed sets match OpenAPI SoT and design.md Data Model.
  - id: NFR-003
    status: pass
    notes: Copy in src/locales/en.json; accessed via getMessage / resolveLabel.
  - id: NFR-004
    status: pass
    notes: >
      English labels match design.md Copy / Wording (sentence case; ATR retained;
      domain terms Regime/Risk/etc. used where appropriate).
  - id: NFR-005
    status: pass
    notes: Unknown-code fallback continues success mapping; fail-closed reserved for structural errors.
  - id: NFR-006
    status: pass
    notes: >
      Regime analysis catalogs not reworked; catalog_reason passed through unchanged;
      source values and flow chrome unchanged.

acceptance_criteria:
  - criterion: >
      On a successful classification response, each regime / risk / economic / exposure
      signal reason from the OpenAPI reason-code enums is shown as catalog human-readable text.
    status: pass
    notes: Mapper humanizes reasons; screen renders locale strings and asserts raw tokens absent.
  - criterion: >
      On a successful analysis response, preferred strategy / catalog strategy tokens
      such as TREND_FOLLOWING are shown as human-readable text via recommendation VM fields.
    status: pass
    notes: Mapper and MarketAnalysisScreen tests assert humanized strategy display.
  - criterion: >
      On a successful analysis response, exposure factor names such as vol_budget_pct
      are shown as human-readable text.
    status: pass
    notes: Covered in mapper and analysis screen success tests.
  - criterion: >
      On a successful analysis response, risk and economic component names in summaries
      are shown as human-readable text.
    status: pass
    notes: Covered in backend mapper and analysis screen success tests.
  - criterion: >
      Locale keys for every in-scope closed-set member exist in en.json; mappers resolve
      via resolveLabel (or thin wrappers) and do not hardcode display English.
    status: pass
    notes: Catalog completeness + no-inline-English mapper source tests.
  - criterion: >
      When an uncatalogued in-scope code appears in an otherwise valid payload, mapping
      succeeds with raw-code fallback and the screen remains in the success state.
    status: pass
    notes: Mapper unknown-code tests; structural fail-closed tests remain separate.
  - criterion: >
      Analysis and Classification UI components continue to consume view models only
      and do not implement DTO-code → label maps.
    status: pass
    notes: Component source-scan tests; no label helpers in feature components.
  - criterion: >
      Idle/empty, loading, success, and error/retry flows remain intact aside from
      humanized success copy.
    status: pass
    notes: Existing screen flow tests retained and still green-oriented in artifacts.
  - criterion: >
      Existing analysisLabels.regime.* and analysisLabels.regimeReason.* catalogs and
      helpers remain in place without being reworked.
    status: pass
    notes: Catalogs and getAnalysisRegimeLabel / getAnalysisRegimeReasonLabel unchanged in pattern.

findings:
  - severity: recommendation
    location: src/features/view-market-*/**/*.test.tsx
    description: >
      Component tests inject pre-humanized view-model fixtures rather than exercising
      an end-to-end fetch→mapper→screen path for unknown-code fallback. Mapper tests
      already cover fallback; optional future integration tests could wire mapper output
      into screens for extra confidence.
    related_req: REQ-010

tasks_verified:
  - task: Add classification reason locale keys to en.json
    status: done
  - task: Add analysisLabels.strategy.* locale keys
    status: done
  - task: Add analysisLabels.exposureFactor.* locale keys
    status: done
  - task: Add riskComponent / economicComponent locale keys
    status: done
  - task: Add thin resolveLabel wrappers for new catalogs
    status: done
  - task: Update classification mapper to humanize signal reasons
    status: done
  - task: Update analysis mapper for strategy tokens
    status: done
  - task: Update analysis mapper for exposure factor names
    status: done
  - task: Humanize risk/economic component summaries; leave catalog_reason unchanged
    status: done
  - task: Confirm unknown-code raw fallback without failing mapping
    status: done
  - task: Verify screens consume VMs only; flows intact
    status: done
  - task: Unit tests for wrappers / catalog completeness + fallback
    status: done
  - task: Classification mapper humanization + fallback + fail-closed tests
    status: done
  - task: Analysis mapper strategy/factors/components + fallback + fail-closed tests
    status: done
  - task: Component coverage for humanized success copy and intact flows
    status: done
```
