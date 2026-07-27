import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { AssessmentsWorkspace } from '../reading-analysis-composition'
import { EvidenceComposition } from '../reading-evidence-composition'
import { DiagnosticsComposition } from './DiagnosticsComposition'
import { mapDiagnosticsSignals } from './mapDiagnosticsFromAnalysis'

const healthyFixture: MarketAnalysisViewModel = {
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

describe('DiagnosticsComposition', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders quiet / minimal Diagnostics when healthy', () => {
    render(
      <DiagnosticsComposition
        regime={healthyFixture.regime}
        risk={healthyFixture.risk}
        economic={healthyFixture.economic}
        exposure={healthyFixture.exposure}
        recommendation={healthyFixture.recommendation}
      />,
    )

    const composition = screen.getByTestId('diagnostics-composition')
    expect(composition).toHaveAttribute('data-presentation', 'quiet')
    expect(composition).toHaveAttribute('data-severity', 'healthy')
    expect(composition).toHaveAttribute('data-prominence', 'cross-cutting')
    expect(
      within(composition).getByText(
        getMessage('readingDiagnostics.statusHealthy'),
      ),
    ).toBeInTheDocument()
    expect(
      within(composition).getByText(
        getMessage('readingDiagnostics.signalPlaceholder'),
      ),
    ).toBeInTheDocument()
    expect(
      composition.querySelector('[data-diagnostics-chrome="quiet"]'),
    ).not.toBeNull()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('elevates qualifying Diagnostics without expanding details by default', async () => {
    const user = userEvent.setup()
    const model = mapDiagnosticsSignals({ hasPartialCoverage: true })

    render(<DiagnosticsComposition model={model} />)

    const composition = screen.getByTestId('diagnostics-composition')
    expect(composition).toHaveAttribute('data-presentation', 'elevated')
    expect(composition).toHaveAttribute('data-severity', 'qualifying')
    expect(composition).toHaveAttribute('data-diagnostics-expanded', 'false')

    const alert = screen.getByRole('alert')
    expect(
      within(alert).getByText(getMessage('readingDiagnostics.statusQualifying')),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(getMessage('readingDiagnostics.kindPartial')),
    ).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: getMessage('readingDiagnostics.showDetails'),
      }),
    )

    expect(composition).toHaveAttribute('data-diagnostics-expanded', 'true')
    expect(
      screen.getByText(getMessage('readingDiagnostics.kindPartial')),
    ).toBeInTheDocument()
  })

  it('shows expanded elevated chrome for blocking trust without a collapse gate', () => {
    const model = mapDiagnosticsSignals({
      regimeReasonCodes: ['insufficient_candles'],
      hardGateReason: 'Hard gate: blocked',
    })

    render(<DiagnosticsComposition model={model} />)

    const composition = screen.getByTestId('diagnostics-composition')
    expect(composition).toHaveAttribute('data-presentation', 'elevated')
    expect(composition).toHaveAttribute('data-severity', 'blocking')
    expect(composition).toHaveAttribute('data-diagnostics-expanded', 'true')

    const alert = screen.getByRole('alert')
    expect(
      within(alert).getByText(getMessage('readingDiagnostics.statusBlocking')),
    ).toBeInTheDocument()
    expect(
      within(alert).getByText(getMessage('readingDiagnostics.kindInsufficient')),
    ).toBeInTheDocument()
    expect(
      within(alert).getByText(getMessage('readingDiagnostics.kindEquivalent')),
    ).toBeInTheDocument()
    expect(
      within(alert).getByText(
        getMessage('analysisLabels.regimeReason.insufficient_candles'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: getMessage('readingDiagnostics.showDetails'),
      }),
    ).not.toBeInTheDocument()
  })

  it('surfaces catalog-linked labels for insufficient / partial / stale / equivalent', () => {
    const model = mapDiagnosticsSignals({
      regimeReasonCodes: ['insufficient_candles'],
      hasPartialCoverage: true,
      isStale: true,
      hardGateReason: 'Capacity constraint',
    })

    render(<DiagnosticsComposition model={model} />)

    expect(
      screen.getByText(getMessage('readingDiagnostics.kindInsufficient')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('readingDiagnostics.kindPartial')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('readingDiagnostics.kindStale')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(getMessage('readingDiagnostics.kindEquivalent')),
    ).toBeInTheDocument()
  })

  it('does not own Assessment outcomes, Recommendation stance, or Evidence kind tables', () => {
    render(
      <DiagnosticsComposition
        regime={healthyFixture.regime}
        recommendation={healthyFixture.recommendation}
      />,
    )

    const composition = screen.getByTestId('diagnostics-composition')
    expect(
      within(composition).queryByText(wording.labels.regime),
    ).not.toBeInTheDocument()
    expect(
      within(composition).queryByText(wording.labels.recommendation),
    ).not.toBeInTheDocument()
    expect(
      within(composition).queryByText(healthyFixture.recommendation.name),
    ).not.toBeInTheDocument()
    expect(
      within(composition).queryByText(getMessage('readingEvidence.drivers')),
    ).not.toBeInTheDocument()
    expect(
      within(composition).queryByText(getMessage('readingEvidence.features')),
    ).not.toBeInTheDocument()
    expect(
      within(composition).queryByText(
        getMessage('readingEvidence.contributions'),
      ),
    ).not.toBeInTheDocument()
    expect(
      composition.querySelector('[data-evidence-kind]'),
    ).toBeNull()
    expect(
      composition.querySelector('[data-unit-role="assessment-peer"]'),
    ).toBeNull()
  })

  it('keeps Analysis primary when rendered beside elevated Diagnostics', () => {
    const model = mapDiagnosticsSignals({
      hardGateReason: 'Hard gate: blocked',
    })

    render(
      <>
        <div data-testid="analysis-primary" data-prominence="primary">
          <AssessmentsWorkspace
            regime={healthyFixture.regime}
            risk={healthyFixture.risk}
            economic={healthyFixture.economic}
            exposure={healthyFixture.exposure}
            recommendation={{
              ...healthyFixture.recommendation,
              hardGateReason: 'Hard gate: blocked',
            }}
          />
        </div>
        <DiagnosticsComposition model={model} />
        <EvidenceComposition
          risk={healthyFixture.risk}
          exposure={healthyFixture.exposure}
        />
      </>,
    )

    expect(screen.getByTestId('analysis-primary')).toHaveAttribute(
      'data-prominence',
      'primary',
    )
    expect(screen.getByTestId('diagnostics-composition')).toHaveAttribute(
      'data-prominence',
      'cross-cutting',
    )
    expect(screen.getByTestId('diagnostics-composition')).not.toHaveAttribute(
      'data-prominence',
      'primary',
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByTestId('assessments-workspace')).toBeInTheDocument()

    // Blocking trust is elevated in Diagnostics — not solely inside Evidence.
    const evidence = screen.getByTestId('evidence-composition')
    expect(
      within(evidence).queryByText(
        getMessage('readingDiagnostics.statusBlocking'),
      ),
    ).not.toBeInTheDocument()
    expect(
      within(screen.getByTestId('diagnostics-composition')).getByText(
        getMessage('readingDiagnostics.statusBlocking'),
      ),
    ).toBeInTheDocument()
  })

  it('resolves Diagnostics chrome copy from feature locale keys', () => {
    expect(messages.readingDiagnostics).toEqual({
      statusHealthy: 'Trust status: healthy.',
      statusQualifying: 'Trust status: qualified.',
      statusBlocking: 'Trust status: blocked.',
      kindInsufficient: 'Insufficient data',
      kindPartial: 'Partial data',
      kindStale: 'Stale data',
      kindEquivalent: 'Data-quality constraint',
      signalPlaceholder: 'Trust details for this Reading will appear here.',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
    })
    expect(getMessage('readingDiagnostics.statusHealthy')).toBe(
      messages.readingDiagnostics.statusHealthy,
    )
  })
})
