import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { EvidenceComposition } from './EvidenceComposition'
import { mapEvidenceFromAnalysis } from './mapEvidenceFromAnalysis'

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

function claimEl(claimId: string) {
  return screen.getByTestId(`claim-attachment-${claimId}`)
}

describe('EvidenceComposition', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders Drivers → Features → Contributions under claim-attached Evidence', () => {
    render(
      <EvidenceComposition
        regime={fixture.regime}
        risk={fixture.risk}
        economic={fixture.economic}
        exposure={fixture.exposure}
        recommendation={fixture.recommendation}
      />,
    )

    const composition = screen.getByTestId('evidence-composition')
    expect(composition).toHaveAttribute('data-unit-id', 'evidence-composition')
    expect(composition).toHaveAttribute('data-supporting', 'true')

    const risk = claimEl('risk')
    expect(
      within(risk).getByText(
        getMessage('readingEvidence.claimAttachment').replace(
          '{claim}',
          wording.labels.risk,
        ),
      ),
    ).toBeInTheDocument()
    expect(within(risk).getByText(getMessage('readingEvidence.drivers'))).toBe(
      within(risk).getByText(messages.readingEvidence.drivers),
    )
    expect(
      within(risk).getByText(getMessage('readingEvidence.features')),
    ).toBeInTheDocument()
    expect(
      within(risk).getByText(getMessage('readingEvidence.contributions')),
    ).toBeInTheDocument()

    expect(
      within(risk).getByText(
        getMessage('analysisLabels.riskComponent.volatility'),
      ),
    ).toBeInTheDocument()
    expect(within(risk).getByText('10%')).toBeInTheDocument()

    expect(within(claimEl('exposure')).getByText(
      getMessage('analysisLabels.exposureFactor.vol_budget_pct'),
    )).toBeInTheDocument()
  })

  it('keeps Features and Contributions collapsed until disclosed', async () => {
    const user = userEvent.setup()
    render(
      <EvidenceComposition
        risk={fixture.risk}
        exposure={fixture.exposure}
      />,
    )

    const risk = claimEl('risk')
    const features = risk.querySelector('[data-evidence-kind="features"]')
    const contributions = risk.querySelector(
      '[data-evidence-kind="contributions"]',
    )
    expect(features).toHaveAttribute('data-disclosure', 'collapsed')
    expect(contributions).toHaveAttribute('data-disclosure', 'collapsed')

    expect(
      within(risk).queryByText(getMessage('readingEvidence.kindPlaceholder')),
    ).not.toBeInTheDocument()

    await user.click(
      within(risk).getByRole('button', {
        name: getMessage('readingEvidence.showFeatures'),
      }),
    )
    expect(features).toHaveAttribute('data-disclosure', 'visible')
    expect(
      within(features as HTMLElement).getByText(
        getMessage('readingEvidence.kindPlaceholder'),
      ),
    ).toBeInTheDocument()

    await user.click(
      within(risk).getByRole('button', {
        name: getMessage('readingEvidence.showContributions'),
      }),
    )
    expect(contributions).toHaveAttribute('data-disclosure', 'visible')
    expect(
      within(contributions as HTMLElement).getByText(
        getMessage('analysisLabels.riskComponent.volatility'),
      ),
    ).toBeInTheDocument()
  })

  it('does not use Metrics or Observations as Evidence kind labels', () => {
    render(
      <EvidenceComposition
        risk={fixture.risk}
        exposure={fixture.exposure}
      />,
    )

    const composition = screen.getByTestId('evidence-composition')
    expect(within(composition).queryByText('Metrics')).not.toBeInTheDocument()
    expect(
      within(composition).queryByText('Observations'),
    ).not.toBeInTheDocument()
    expect(composition.querySelector('[data-evidence-kind="metrics"]')).toBeNull()
    expect(
      composition.querySelector('[data-evidence-kind="observations"]'),
    ).toBeNull()
  })

  it('keeps claim-structured empty Evidence when no explainability rows exist', () => {
    render(
      <EvidenceComposition
        risk={{ summary: '', level: '0.1' }}
        exposure={{ summary: '0%', factors: [] }}
      />,
    )

    const composition = screen.getByTestId('evidence-composition')
    expect(within(composition).getByTestId('claim-attachment-risk')).toBe(
      claimEl('risk'),
    )
    expect(
      within(claimEl('risk')).getByText(
        getMessage('readingEvidence.emptyForClaim'),
      ),
    ).toBeInTheDocument()
    expect(
      within(claimEl('risk')).getByText(getMessage('readingEvidence.drivers')),
    ).toBeInTheDocument()
    expect(
      within(claimEl('risk')).getByText(getMessage('readingEvidence.features')),
    ).toBeInTheDocument()
    expect(
      within(claimEl('risk')).getByText(
        getMessage('readingEvidence.contributions'),
      ),
    ).toBeInTheDocument()
  })

  it('resolves Evidence chrome labels from the feature locale catalog', () => {
    expect(messages.readingEvidence).toEqual({
      drivers: 'Drivers',
      features: 'Features',
      contributions: 'Contributions',
      claimAttachment: 'Evidence for {claim}',
      kindPlaceholder: 'Content for this Evidence depth will appear here.',
      emptyForClaim: 'No Evidence rows for this claim yet.',
      showFeatures: 'Show Features',
      showContributions: 'Show Contributions',
      hideDepth: 'Hide',
    })
    expect(getMessage('readingEvidence.drivers')).toBe(
      messages.readingEvidence.drivers,
    )
  })

  it('maps assessment components and exposure factors into claim attachments', () => {
    const model = mapEvidenceFromAnalysis({
      risk: fixture.risk,
      economic: fixture.economic,
      exposure: fixture.exposure,
    })

    expect(model.claimAttachments.map((a) => a.claimId)).toEqual([
      'risk',
      'economic',
      'exposure',
    ])
    expect(model.claimAttachments[0]?.drivers.rows[0]?.name).toBe(
      getMessage('analysisLabels.riskComponent.volatility'),
    )
    expect(model.claimAttachments[0]?.drivers.rows[0]?.source).toBe(
      'assessment-component',
    )
    expect(model.claimAttachments[2]?.contributions.rows[0]?.source).toBe(
      'exposure-factor',
    )
  })
})
