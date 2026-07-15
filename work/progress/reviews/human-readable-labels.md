# Review Report: human-readable-labels

```yaml
feature:
  slug: human-readable-labels

decision: APPROVED

summary: >
  Backend analysis regime labels and reason codes are resolved through
  locale-backed helpers into the market analysis view model. Catalog
  completeness, safe fallback, mapper wiring, view-model boundary, and
  flow preservation match the approved requirements, design, and tasks.
  Automated tests cover helpers, mapper (including unknown codes and
  fail-closed structural errors), and screen success/loading/error/retry.

requirements:
  - id: REQ-001
    status: pass
    notes: >
      mapBackendPayload sets regime.level via getAnalysisRegimeLabel
      (mapMarketAnalysis.ts). mapMarketAnalysis.test.ts asserts
      TREND_UP → getMessage('analysisLabels.regime.TREND_UP').

  - id: REQ-002
    status: pass
    notes: >
      Each regime.reasons entry is passed through
      getAnalysisRegimeReasonLabel and joined with ", " into
      regime.summary. Fixture with adx_strong + plus_di_dominant
      asserts catalog English joined summary.

  - id: REQ-003
    status: pass
    notes: >
      Display English lives in src/locales/en.json under
      analysisLabels.*; helpers use getMessage; mapper contains no
      inline display phrases (source scan test).

  - id: REQ-004
    status: pass
    notes: >
      resolveLabel returns raw code on miss/empty; mapper test with
      MYSTERY_REGIME and totally_unknown_reason succeeds and preserves
      other mapped fields.

  - id: REQ-005
    status: pass
    notes: >
      AssessmentSection renders assessment.level/summary only.
      Screen test asserts no getAnalysisRegime* / analysisLabels /
      TREND_UP in component sources; fixture uses humanized VM strings.

  - id: REQ-006
    status: pass
    notes: >
      MarketAnalysisScreen.test.tsx still covers idle/empty, loading,
      success, error+retry, and stale-response; observable flow outcomes
      unchanged aside from humanized success copy.

  - id: REQ-007
    status: pass
    notes: >
      resolveLabel(catalogPrefix, code) is reusable; wrappers
      getAnalysisRegimeLabel / getAnalysisRegimeReasonLabel fix
      analysis catalog prefixes. No classification catalogs added
      (NFR-006).

  - id: REQ-008
    status: pass
    notes: >
      All five OpenAPI AnalysisRegimeLabel members present in
      en.json with design Copy/Wording English; labels.test.ts
      completeness + resolution coverage.

  - id: REQ-009
    status: pass
    notes: >
      All 19 OpenAPI AnalysisRegimeReasonCode members present in
      en.json matching design Copy/Wording; labels.test.ts
      completeness + resolution coverage. Verified against
      shared/openapi.json enums.

acceptance_criteria:
  - criterion: >
      On successful analysis with regime.regime = TREND_UP (or any
      AnalysisRegimeLabel), UI shows catalog human-readable text,
      not the raw token.
    status: pass
    notes: >
      Mapper humanizes before VM reaches UI; screen success test
      finds getMessage('analysisLabels.regime.TREND_UP') and asserts
      TREND_UP absent as sole label.

  - criterion: >
      On successful analysis with regime.reasons, summary uses
      human-readable reason text (not raw comma-joined tokens alone).
    status: pass
    notes: >
      Summary is humanized reason texts joined by ", "; screen asserts
      catalog reason strings and absence of adx_strong as display.

  - criterion: >
      Locale keys for every OpenAPI AnalysisRegimeLabel and
      AnalysisRegimeReasonCode exist in src/locales/en.json.
    status: pass
    notes: Full closed sets present under analysisLabels.regime and
      analysisLabels.regimeReason.

  - criterion: >
      Mapper/helpers do not hardcode display English; resolve via
      locale / label helper layer.
    status: pass
    notes: labels.ts → getMessage; mapper imports helpers only;
      hardcoded-phrase source guard in mapper tests.

  - criterion: >
      Unknown/uncatalogued label or reason on otherwise valid payload
      maps with safe fallback; Analysis stays success.
    status: pass
    notes: >
      Fallback = raw code; mapping continues; structural invalidity
      still fail-closed (unchanged).

  - criterion: >
      Analysis UI consumes view model only; no DTO-code → label maps
      in components.
    status: pass
    notes: Component source guard + AssessmentSection binds VM fields.

  - criterion: >
      Idle/empty, loading, success, and error/retry remain intact
      aside from humanized success copy.
    status: pass
    notes: Existing screen tests still green for those paths.

  - criterion: >
      Reusable label-resolution helper exists and is used by analysis
      mapping path.
    status: pass
    notes: resolveLabel used via analysis wrappers in mapBackendPayload.

findings:
  - severity: recommendation
    location: src/i18n/labels.test.ts
    description: >
      resolveLabel treats empty catalog string as fallback to raw
      code (design Fallback rule), but there is no dedicated unit
      test asserting the empty-value path (only missing-key fallback
      is tested).
    related_req: REQ-004

  - severity: recommendation
    location: src/api/marketAnalysis/mapMarketAnalysis.test.ts
    description: >
      "does not hardcode analysis display English" samples a subset
      of design phrases rather than the full Copy/Wording table;
      current implementation still has none of the design English
      inline—broader sample would harden the guard.
    related_req: REQ-003

tasks_verified:
  - task: Add analysisLabels.regime.* locale keys for every AnalysisRegimeLabel
    status: done
  - task: Add analysisLabels.regimeReason.* locale keys for every AnalysisRegimeReasonCode
    status: done
  - task: Implement reusable label-resolution helper (getMessage, raw-code fallback)
    status: done
  - task: Implement getAnalysisRegimeLabel / getAnalysisRegimeReasonLabel wrappers
    status: done
  - task: Update mapMarketAnalysis for humanized regime.regime label
    status: done
  - task: Update mapMarketAnalysis for humanized regime.reasons summary
    status: done
  - task: Confirm unknown codes fall back without failing mapping
    status: done
  - task: Verify screen consumes VM only; flows intact
    status: done
  - task: Unit tests for label helpers (all members + unknown fallback)
    status: done
  - task: Unit tests for mapMarketAnalysis (humanized, unknown, fail-closed)
    status: done
  - task: Component coverage for humanized success + loading/error/retry
    status: done
```
