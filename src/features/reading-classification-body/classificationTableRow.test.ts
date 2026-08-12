import { describe, expect, it } from 'vitest'
import type { ClassificationSignal } from '../../api/marketClassification/types'
import {
  mapSignalToTableRow,
  shouldDisplaySignal,
  visibleSignals,
} from './classificationTableRow'

describe('classificationTableRow', () => {
  it('maps source to factor and preserves score and reason', () => {
    const signal: ClassificationSignal = {
      source: 'regime',
      score: 0.92,
      reason: 'Trend up',
    }

    expect(mapSignalToTableRow(signal)).toEqual({
      factor: 'regime',
      score: 0.92,
      reason: 'Trend up',
    })
  })

  it('omits blank factor, score, or reason cells without dropping the row when other fields exist', () => {
    expect(
      mapSignalToTableRow({ source: 'regime', score: 0.5, reason: '' }),
    ).toEqual({
      factor: 'regime',
      score: 0.5,
      reason: null,
    })
    expect(
      mapSignalToTableRow({ source: '', score: 0.5, reason: 'Low risk' }),
    ).toEqual({
      factor: null,
      score: 0.5,
      reason: 'Low risk',
    })
    expect(
      mapSignalToTableRow({ source: 'risk', score: Number.NaN, reason: 'x' }),
    ).toEqual({
      factor: 'risk',
      score: null,
      reason: 'x',
    })
  })

  it('drops signals only when factor, score, and reason are all absent', () => {
    const absent: ClassificationSignal = {
      source: '',
      score: Number.NaN,
      reason: '   ',
    }
    expect(shouldDisplaySignal(mapSignalToTableRow(absent))).toBe(false)
    expect(visibleSignals([absent])).toEqual([])
    expect(
      visibleSignals([
        absent,
        { source: 'regime', score: 0, reason: '' },
      ]),
    ).toEqual([{ source: 'regime', score: 0, reason: '' }])
  })
})
