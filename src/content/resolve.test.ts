import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  formatParamNumber,
  interpolateTemplate,
  resolve,
  v1CodeRegistry,
} from './index'
import type { MessageChannel, MessageRef } from './types'

describe('formatParamNumber', () => {
  it('formats integers without scientific notation', () => {
    expect(formatParamNumber(0)).toBe('0')
    expect(formatParamNumber(42)).toBe('42')
    expect(formatParamNumber(-7)).toBe('-7')
  })

  it('formats floats with up to 4 fractional digits, trimmed', () => {
    expect(formatParamNumber(0.9)).toBe('0.9')
    expect(formatParamNumber(0.75)).toBe('0.75')
    expect(formatParamNumber(-0.01)).toBe('-0.01')
    expect(formatParamNumber(1.23456)).toBe('1.2346')
  })
})

describe('interpolateTemplate', () => {
  it('replaces named placeholders from params', () => {
    expect(
      interpolateTemplate('Strategy {strategy} for {regime}.', {
        strategy: 'TREND_FOLLOWING',
        regime: 'TREND_UP',
      }),
    ).toBe('Strategy TREND_FOLLOWING for TREND_UP.')
  })

  it('formats number params and uses empty string for missing params', () => {
    expect(
      interpolateTemplate('score={risk_score} edge={edge} x={missing}', {
        risk_score: 0.75,
        edge: -0.01,
      }),
    ).toBe('score=0.75 edge=-0.01 x=')
  })
})

describe('resolve', () => {
  it('exports DEFAULT_LOCALE en and a populated v1CodeRegistry', () => {
    expect(DEFAULT_LOCALE).toBe('en')
    expect(Object.keys(v1CodeRegistry)).toHaveLength(23)
  })

  it('resolves analysis MessageRef with params (exact interpolated text)', () => {
    const messages: MessageRef[] = [
      {
        code: 'catalog.strategy_allowed',
        params: {
          strategy: 'TREND_FOLLOWING',
          regime: 'TREND_UP',
          risk_score: 0.42,
          edge: 0.75,
        },
      },
      {
        code: 'catalog.hard_gate.risk_too_high',
        params: { risk_score: 0.9 },
      },
    ]

    const resolved = resolve({
      locale: 'en',
      channel: 'ui',
      messages,
    })

    expect(resolved).toHaveLength(2)
    expect(resolved[0]).toEqual({
      code: 'catalog.strategy_allowed',
      locale: 'en',
      text: 'Strategy TREND_FOLLOWING is allowed for regime TREND_UP.',
    })
    expect(resolved[1]).toEqual({
      code: 'catalog.hard_gate.risk_too_high',
      locale: 'en',
      text: 'Hard gate: risk score 0.9 is too high.',
    })
  })

  it('resolves classification MessageRefs with empty params', () => {
    const messages: MessageRef[] = [
      { code: 'trend_up', params: {} },
      { code: 'low_risk' },
    ]

    const resolved = resolve({
      locale: 'en',
      channel: 'ui',
      messages,
    })

    expect(resolved).toEqual([
      { code: 'trend_up', locale: 'en', text: 'Trend up' },
      { code: 'low_risk', locale: 'en', text: 'Low risk' },
    ])
  })

  it('falls back per message for unknown codes without aborting the batch', () => {
    const messages: MessageRef[] = [
      { code: 'trend_up' },
      { code: 'not.a.registered.code' },
      {
        code: 'catalog.wait',
        params: { gate: 'extreme_regime' },
      },
    ]

    const resolved = resolve({
      locale: 'en',
      channel: 'ui',
      messages,
    })

    expect(resolved).toHaveLength(3)
    expect(resolved[0]).toEqual({
      code: 'trend_up',
      locale: 'en',
      text: 'Trend up',
    })
    expect(resolved[1]).toEqual({
      code: 'not.a.registered.code',
      locale: 'en',
      text: 'not.a.registered.code',
      meta: { fallback: 'unknown_code' },
    })
    expect(resolved[2]).toEqual({
      code: 'catalog.wait',
      locale: 'en',
      text: 'Catalog waiting — gated by extreme_regime.',
    })
  })

  it('falls back to en when requested locale has no templates', () => {
    const resolved = resolve({
      locale: 'es',
      channel: 'ui',
      messages: [{ code: 'chaotic' }],
    })

    expect(resolved).toEqual([
      {
        code: 'chaotic',
        locale: 'en',
        text: 'Chaotic',
        meta: { fallback: 'locale_fallback' },
      },
    ])
  })

  it('treats unsupported channel as missing template without throwing', () => {
    const resolved = resolve({
      locale: 'en',
      channel: 'email' as MessageChannel,
      messages: [{ code: 'trend_up' }, { code: 'unknown.x' }],
    })

    expect(resolved).toEqual([
      {
        code: 'trend_up',
        locale: 'en',
        text: 'trend_up',
        meta: { fallback: 'missing_template' },
      },
      {
        code: 'unknown.x',
        locale: 'en',
        text: 'unknown.x',
        meta: { fallback: 'unknown_code' },
      },
    ])
  })

  it('returns empty array for empty messages and does not mutate input', () => {
    expect(resolve({ locale: 'en', channel: 'ui', messages: [] })).toEqual([])

    const params = { gate: 'no_capacity' }
    const messages: MessageRef[] = [{ code: 'catalog.wait', params }]
    const snapshot = structuredClone(messages)

    resolve({ locale: 'en', channel: 'ui', messages })

    expect(messages).toEqual(snapshot)
    expect(params).toEqual({ gate: 'no_capacity' })
  })
})
