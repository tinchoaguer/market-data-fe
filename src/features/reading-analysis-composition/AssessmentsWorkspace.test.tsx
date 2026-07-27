import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { AssessmentsWorkspace } from './AssessmentsWorkspace'

const fixture: MarketAnalysisViewModel = {
  symbol: 'BTC/USDT',
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
}

function unitEl(id: string) {
  const el = document.querySelector(`[data-unit-id="${id}"]`)
  expect(el).not.toBeNull()
  return el as HTMLElement
}

describe('AssessmentsWorkspace', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders exactly one Assessments workspace with four peer units and Recommendation', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    const workspaces = screen.getAllByTestId('assessments-workspace')
    expect(workspaces).toHaveLength(1)
    expect(
      screen.getByText(getMessage('readingAnalysis.assessmentsLabel')),
    ).toBe(screen.getByText(messages.readingAnalysis.assessmentsLabel))

    expect(unitEl('regime')).toHaveAttribute('data-unit-role', 'assessment-peer')
    expect(unitEl('risk')).toHaveAttribute('data-unit-role', 'assessment-peer')
    expect(unitEl('economic')).toHaveAttribute(
      'data-unit-role',
      'assessment-peer',
    )
    expect(unitEl('exposure')).toHaveAttribute(
      'data-unit-role',
      'assessment-peer',
    )
    expect(unitEl('recommendation')).toHaveAttribute(
      'data-unit-role',
      'recommendation',
    )
    expect(unitEl('recommendation')).toHaveAttribute('data-compact', 'true')

    const peers = document.querySelectorAll('[data-unit-role="assessment-peer"]')
    expect(peers).toHaveLength(4)
  })

  it('uses brand wording labels for peers and Recommendation', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    expect(within(unitEl('regime')).getByText(wording.labels.regime)).toBe(
      within(unitEl('regime')).getByText(wording.labels.regime),
    )
    expect(within(unitEl('risk')).getByText(wording.labels.risk)).toBeInTheDocument()
    expect(
      within(unitEl('economic')).getByText(wording.labels.economic),
    ).toBeInTheDocument()
    expect(
      within(unitEl('exposure')).getByText(wording.labels.exposure),
    ).toBeInTheDocument()
    expect(
      within(unitEl('recommendation')).getByText(wording.labels.recommendation),
    ).toBeInTheDocument()

    expect(wording.labels.regime).toBe('Regime')
    expect(wording.labels.risk).toBe('Risk')
    expect(wording.labels.economic).toBe('Economic')
    expect(wording.labels.exposure).toBe('Exposure')
    expect(wording.labels.recommendation).toBe('Recommendation')
  })

  it('places Recommendation after Assessment peers inside Assessments', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    const workspace = unitEl('assessments')
    const unitIds = Array.from(
      workspace.querySelectorAll('[data-unit-id]'),
    )
      .map((node) => node.getAttribute('data-unit-id'))
      .filter((id) => id !== 'assessments')

    expect(unitIds).toEqual([
      'regime',
      'risk',
      'economic',
      'exposure',
      'recommendation',
    ])

    const lastPeerIndex = unitIds.indexOf('exposure')
    const recommendationIndex = unitIds.indexOf('recommendation')
    expect(recommendationIndex).toBeGreaterThan(lastPeerIndex)
  })

  it('surfaces mapped outcomes and Recommendation stance when available', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    expect(
      within(unitEl('regime')).getByText(fixture.regime.level),
    ).toBeInTheDocument()
    expect(
      within(unitEl('regime')).getByText(fixture.regime.summary),
    ).toBeInTheDocument()
    expect(
      within(unitEl('risk')).getByText(fixture.risk.level),
    ).toBeInTheDocument()
    expect(
      within(unitEl('exposure')).getByText(fixture.exposure.summary),
    ).toBeInTheDocument()
    expect(
      within(unitEl('recommendation')).getByText(fixture.recommendation.name),
    ).toBeInTheDocument()
    expect(
      unitEl('recommendation').querySelector('[data-recommendation-stance]'),
    ).not.toBeNull()
  })

  it('does not own assessment components or exposure factors as Assessment primary body', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    expect(
      unitEl('risk').querySelector('[data-assessment-components]'),
    ).toBeNull()
    expect(
      unitEl('economic').querySelector('[data-assessment-components]'),
    ).toBeNull()
    expect(
      unitEl('exposure').querySelector('[data-assessment-components]'),
    ).toBeNull()
    expect(
      within(unitEl('risk')).queryByText(
        getMessage('analysisLabels.riskComponent.volatility'),
      ),
    ).not.toBeInTheDocument()
    expect(
      within(unitEl('exposure')).queryByText(
        getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
      ),
    ).not.toBeInTheDocument()
    expect(
      unitEl('risk').querySelector('[data-evidence-reference="risk"]'),
    ).not.toBeNull()
  })

  it('surfaces hardGateReason on Recommendation when present', () => {
    render(
      <AssessmentsWorkspace
        recommendation={{
          ...fixture.recommendation,
          hardGateReason: 'Hard gate: risk score 0.91 is too high.',
        }}
      />,
    )

    expect(
      within(unitEl('recommendation')).getByText(
        'Hard gate: risk score 0.91 is too high.',
      ),
    ).toBeInTheDocument()
    expect(
      unitEl('recommendation').querySelector('[data-hard-gate-reason]'),
    ).not.toBeNull()
  })

  it('keeps labeled gray-box peers and Recommendation when content is missing', () => {
    render(<AssessmentsWorkspace />)

    for (const id of ['regime', 'risk', 'economic', 'exposure'] as const) {
      expect(within(unitEl(id)).getByText(wording.labels[id])).toBeInTheDocument()
      expect(
        within(unitEl(id)).getByText(
          getMessage('readingAnalysis.unitPlaceholder'),
        ),
      ).toBeInTheDocument()
    }

    expect(
      within(unitEl('recommendation')).getByText(wording.labels.recommendation),
    ).toBeInTheDocument()
    expect(
      within(unitEl('recommendation')).getByText(
        getMessage('readingAnalysis.recommendationPlaceholder'),
      ),
    ).toBeInTheDocument()
  })

  it('binds Narrative to a claim unit and does not expose Narrative/Overall/Synthesis Regions', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        recommendation={fixture.recommendation}
        narratives={{
          regime: 'Bound regime takeaway',
          recommendation: 'Bound stance takeaway',
        }}
      />,
    )

    const regimeNarrative = unitEl('regime').querySelector(
      '[data-claim-narrative="regime"]',
    )
    expect(regimeNarrative).not.toBeNull()
    expect(regimeNarrative).toHaveAttribute('data-bound-to', 'regime')
    expect(regimeNarrative).toHaveTextContent('Bound regime takeaway')

    const recommendationNarrative = unitEl('recommendation').querySelector(
      '[data-claim-narrative="recommendation"]',
    )
    expect(recommendationNarrative).not.toBeNull()
    expect(recommendationNarrative).toHaveAttribute(
      'data-bound-to',
      'recommendation',
    )

    expect(document.querySelector('[data-unit-id="narrative"]')).toBeNull()
    expect(document.querySelector('[data-unit-id="overall"]')).toBeNull()
    expect(document.querySelector('[data-unit-id="synthesis"]')).toBeNull()
    expect(screen.queryByText('Narrative')).not.toBeInTheDocument()
    expect(screen.queryByText('Overall Assessment')).not.toBeInTheDocument()
    expect(screen.queryByText('Overall Score')).not.toBeInTheDocument()
    expect(screen.queryByText('Synthesis')).not.toBeInTheDocument()
  })

  it('does not nest Classification as an Analysis-owned Region under Assessments', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    const workspace = unitEl('assessments')
    expect(
      workspace.querySelector('[data-region-id="classification"]'),
    ).toBeNull()
    expect(
      within(workspace).queryByText(messages.readingLayout.regionClassification),
    ).not.toBeInTheDocument()
    expect(
      workspace.querySelector('[data-unit-id="classification-body"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-unit-id="overall-classification"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-unit-id="primary-classification"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-unit-id="secondary-classification"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-region-id="evidence"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-region-id="market-data"]'),
    ).toBeNull()
    expect(
      workspace.querySelector('[data-region-id="diagnostics"]'),
    ).toBeNull()
  })

  it('does not present Confidence or data-quality as an Assessment peer dimension', () => {
    render(
      <AssessmentsWorkspace
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    const peers = document.querySelectorAll('[data-unit-role="assessment-peer"]')
    expect(peers).toHaveLength(4)
    const peerIds = Array.from(peers).map((node) =>
      node.getAttribute('data-unit-id'),
    )
    expect(peerIds).toEqual(['regime', 'risk', 'economic', 'exposure'])
    expect(peerIds).not.toContain('confidence')
    expect(peerIds).not.toContain('data-quality')
    expect(document.querySelector('[data-unit-id="confidence"]')).toBeNull()
    expect(screen.queryByText('Confidence')).not.toBeInTheDocument()
    expect(screen.queryByText('Data quality')).not.toBeInTheDocument()
  })

  it('resolves feature locale keys for Assessments chrome', () => {
    expect(messages.readingAnalysis).toEqual({
      assessmentsLabel: 'Assessments',
      unitPlaceholder: 'Content for this Assessment will appear here.',
      recommendationPlaceholder: 'Recommendation stance will appear here.',
      narrativePlaceholder: 'Narrative for this claim will appear here.',
    })
    expect(getMessage('readingAnalysis.assessmentsLabel')).toBe(
      messages.readingAnalysis.assessmentsLabel,
    )
  })
})
