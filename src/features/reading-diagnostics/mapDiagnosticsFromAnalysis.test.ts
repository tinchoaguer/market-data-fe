import { describe, expect, it } from 'vitest'
import { getMessage } from '../../i18n/messages'
import {
  deriveDiagnosticsMappingInput,
  mapDiagnosticsFromAnalysis,
  mapDiagnosticsSignals,
} from './mapDiagnosticsFromAnalysis'

describe('mapDiagnosticsSignals', () => {
  it('returns quiet healthy model when no trust signals are mapped', () => {
    const model = mapDiagnosticsSignals({})

    expect(model).toEqual({
      severity: 'healthy',
      presentation: 'quiet',
      signals: [],
    })
  })

  it('maps insufficient_candles reason code to blocking insufficient signal', () => {
    const model = mapDiagnosticsSignals({
      regimeReasonCodes: ['insufficient_candles', 'adx_strong'],
    })

    expect(model.severity).toBe('blocking')
    expect(model.presentation).toBe('elevated')
    expect(model.signals).toEqual([
      expect.objectContaining({
        kind: 'insufficient',
        severity: 'blocking',
        label: getMessage('readingDiagnostics.kindInsufficient'),
        detail: getMessage('analysisLabels.regimeReason.insufficient_candles'),
        sourceRef: 'regime.summary',
      }),
    ])
  })

  it('maps humanized insufficient label from regime summary', () => {
    const model = mapDiagnosticsSignals({
      regimeReasonLabels: [
        getMessage('analysisLabels.regimeReason.insufficient_candles'),
      ],
      hasInsufficientDataFlag: true,
    })

    expect(model.signals[0]?.kind).toBe('insufficient')
    expect(model.severity).toBe('blocking')
  })

  it('maps partial coverage to qualifying partial signal', () => {
    const model = mapDiagnosticsSignals({ hasPartialCoverage: true })

    expect(model.severity).toBe('qualifying')
    expect(model.presentation).toBe('elevated')
    expect(model.signals).toEqual([
      expect.objectContaining({
        kind: 'partial',
        severity: 'qualifying',
        label: getMessage('readingDiagnostics.kindPartial'),
      }),
    ])
  })

  it('maps stale freshness flag to qualifying stale signal', () => {
    const model = mapDiagnosticsSignals({ isStale: true })

    expect(model.signals).toEqual([
      expect.objectContaining({
        kind: 'stale',
        severity: 'qualifying',
        label: getMessage('readingDiagnostics.kindStale'),
      }),
    ])
  })

  it('maps hard-gate reason to blocking equivalent signal with catalog-linked kind label', () => {
    const hardGate = 'Hard gate: risk score 0.91 is too high.'
    const model = mapDiagnosticsSignals({ hardGateReason: hardGate })

    expect(model.severity).toBe('blocking')
    expect(model.presentation).toBe('elevated')
    expect(model.signals).toEqual([
      expect.objectContaining({
        kind: 'equivalent',
        severity: 'blocking',
        label: getMessage('readingDiagnostics.kindEquivalent'),
        detail: hardGate,
        sourceRef: 'recommendation.hardGateReason',
      }),
    ])
  })

  it('aggregates severity to the strongest mapped signal', () => {
    const model = mapDiagnosticsSignals({
      hasPartialCoverage: true,
      hardGateReason: 'blocked',
    })

    expect(model.severity).toBe('blocking')
    expect(model.signals.map((signal) => signal.kind).sort()).toEqual([
      'equivalent',
      'partial',
    ])
  })

  it('falls back to raw unknown insufficient-like code without failing the map', () => {
    const model = mapDiagnosticsSignals({
      regimeReasonCodes: ['insufficient_unknown_series'],
    })

    expect(model.severity).toBe('blocking')
    expect(model.signals[0]?.detail).toBe('insufficient_unknown_series')
  })
})

describe('mapDiagnosticsFromAnalysis', () => {
  it('derives quiet healthy from a complete Analysis fixture', () => {
    const model = mapDiagnosticsFromAnalysis({
      regime: {
        summary: getMessage('analysisLabels.regimeReason.adx_strong'),
        level: getMessage('analysisLabels.regime.TREND_UP'),
      },
      risk: {
        summary: '',
        level: '0.17',
        components: [
          {
            name: getMessage('analysisLabels.riskComponent.volatility'),
            value: 0.1,
            displayValue: '10%',
          },
        ],
      },
      economic: {
        summary: '',
        level: '0.42',
        components: [
          {
            name: getMessage('analysisLabels.economicComponent.activity'),
            value: 0.88,
            displayValue: '88%',
          },
        ],
      },
      exposure: {
        summary: '35%',
        factors: [
          {
            name: getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
            weight: 0.35,
            displayWeight: '35%',
          },
        ],
      },
      recommendation: {
        catalogId: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
        name: getMessage('analysisLabels.strategy.TREND_FOLLOWING'),
        rationale: 'Preferred for TREND_UP with acceptable risk',
        hardGateReason: null,
      },
    })

    expect(model.severity).toBe('healthy')
    expect(model.presentation).toBe('quiet')
    expect(model.signals).toEqual([])
  })

  it('elevates when regime summary includes insufficient candles', () => {
    const model = mapDiagnosticsFromAnalysis({
      regime: {
        summary: getMessage('analysisLabels.regimeReason.insufficient_candles'),
        level: getMessage('analysisLabels.regime.CHAOTIC'),
      },
      recommendation: {
        catalogId: getMessage('analysisLabels.strategy.OTHER'),
        name: getMessage('analysisLabels.strategy.OTHER'),
        rationale: 'Limited',
        hardGateReason: null,
      },
    })

    expect(model.presentation).toBe('elevated')
    expect(model.signals[0]?.kind).toBe('insufficient')
  })

  it('elevates when hardGateReason qualifies trust', () => {
    const model = mapDiagnosticsFromAnalysis({
      regime: {
        summary: getMessage('analysisLabels.regimeReason.adx_strong'),
        level: getMessage('analysisLabels.regime.TREND_UP'),
      },
      recommendation: {
        catalogId: getMessage('analysisLabels.strategy.OTHER'),
        name: getMessage('analysisLabels.strategy.OTHER'),
        rationale: 'Gated',
        hardGateReason: 'Capacity hard gate',
      },
    })

    expect(model.severity).toBe('blocking')
    expect(model.signals[0]?.kind).toBe('equivalent')
  })

  it('derives partial coverage from empty structured Assessment depth', () => {
    const input = deriveDiagnosticsMappingInput({
      risk: { summary: '', level: '0.1', components: [] },
      economic: { summary: '', level: '0.2', components: [] },
      exposure: { summary: '', factors: [] },
    })

    expect(input.hasPartialCoverage).toBe(true)
    expect(mapDiagnosticsSignals(input).signals[0]?.kind).toBe('partial')
  })
})
