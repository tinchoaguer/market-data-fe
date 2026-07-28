import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { wording } from '@market-data/brand/wording'
import { getMessage, messages } from '../../i18n/messages'
import { ReadingWorkspace } from './ReadingWorkspace'

const REGION_LABELS = [
  messages.readingLayout.regionContext,
  messages.readingLayout.regionAnalysis,
  messages.readingLayout.regionClassification,
  messages.readingLayout.regionEvidence,
  messages.readingLayout.regionMarketData,
  messages.readingLayout.regionDiagnostics,
] as const

function regionEl(id: string) {
  const el = document.querySelector(`[data-region-id="${id}"]`)
  expect(el).not.toBeNull()
  return el as HTMLElement
}

describe('ReadingWorkspace', () => {
  afterEach(() => {
    cleanup()
  })

  it('exposes six catalog-linked Region labels on a successful Reading', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    for (const label of REGION_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    expect(screen.getByText(getMessage('readingLayout.regionContext'))).toBe(
      screen.getByText(messages.readingLayout.regionContext),
    )
    expect(screen.getByText(getMessage('readingLayout.regionAnalysis'))).toBe(
      screen.getByText(messages.readingLayout.regionAnalysis),
    )
  })

  it('places Context before the Analysis–Classification workspace and supporting Regions', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    const context = regionEl('context')
    const analysis = regionEl('analysis')
    const evidence = regionEl('evidence')
    const marketData = regionEl('market-data')

    expect(context).toHaveAttribute('data-reading-band', 'primary')
    expect(analysis).toHaveAttribute('data-reading-band', 'primary')
    expect(evidence).toHaveAttribute('data-reading-band', 'supporting')
    expect(marketData).toHaveAttribute('data-reading-band', 'supporting')

    const workspace = screen.getByTestId('reading-workspace')
    const regions = Array.from(
      workspace.querySelectorAll('[data-region-id]'),
    ).map((node) => node.getAttribute('data-region-id'))

    expect(regions).toEqual([
      'context',
      'analysis',
      'classification',
      'evidence',
      'market-data',
      'diagnostics',
    ])

    const contextIndex = regions.indexOf('context')
    const analysisIndex = regions.indexOf('analysis')
    const evidenceIndex = regions.indexOf('evidence')
    const marketDataIndex = regions.indexOf('market-data')

    expect(contextIndex).toBeLessThan(evidenceIndex)
    expect(analysisIndex).toBeLessThan(evidenceIndex)
    expect(contextIndex).toBeLessThan(marketDataIndex)
    expect(analysisIndex).toBeLessThan(marketDataIndex)
  })

  it('marks Analysis as the only primary Region; Context is not primary', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    expect(regionEl('analysis')).toHaveAttribute('data-prominence', 'primary')
    expect(regionEl('context')).toHaveAttribute('data-prominence', 'supporting')
    expect(regionEl('context')).not.toHaveAttribute('data-prominence', 'primary')
    expect(regionEl('classification')).toHaveAttribute(
      'data-prominence',
      'associated',
    )
    expect(regionEl('classification')).not.toHaveAttribute(
      'data-prominence',
      'primary',
    )
    expect(regionEl('market-data')).not.toHaveAttribute(
      'data-prominence',
      'primary',
    )
    expect(regionEl('evidence')).not.toHaveAttribute('data-prominence', 'primary')
    expect(regionEl('diagnostics')).toHaveAttribute(
      'data-prominence',
      'cross-cutting',
    )

    const primaryRegions = document.querySelectorAll(
      '[data-prominence="primary"]',
    )
    expect(primaryRegions).toHaveLength(1)
    expect(primaryRegions[0]).toHaveAttribute('data-region-id', 'analysis')
  })

  it('keeps Classification adjacent to Analysis in the primary workspace row', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    const primaryBand = screen.getByTestId('reading-band-primary')
    expect(
      within(primaryBand).getByText(messages.readingLayout.regionAnalysis),
    ).toBeInTheDocument()
    expect(
      within(primaryBand).getByText(messages.readingLayout.regionClassification),
    ).toBeInTheDocument()
    expect(
      within(primaryBand).queryByText(messages.readingLayout.regionContext),
    ).not.toBeInTheDocument()

    const bandRegions = Array.from(
      primaryBand.querySelectorAll('[data-region-id]'),
    ).map((node) => node.getAttribute('data-region-id'))

    expect(bandRegions).toEqual(['analysis', 'classification'])
    expect(regionEl('classification')).toHaveAttribute(
      'data-prominence',
      'associated',
    )
    expect(regionEl('classification')).not.toHaveAttribute(
      'data-prominence',
      'primary',
    )
    expect(regionEl('analysis')).toHaveAttribute('data-prominence', 'primary')
  })

  it('places Evidence and Market Data side-by-side in the supporting row', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    const supporting = screen.getByTestId('reading-band-supporting')
    const bandRegions = Array.from(
      supporting.querySelectorAll('[data-region-id]'),
    ).map((node) => node.getAttribute('data-region-id'))

    expect(bandRegions).toEqual(['evidence', 'market-data'])
  })

  it('does not expose Narrative or Overall Score Regions', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    expect(screen.queryByText('Narrative')).not.toBeInTheDocument()
    expect(screen.queryByText('Overall Score')).not.toBeInTheDocument()
    expect(screen.queryByText('Overall State')).not.toBeInTheDocument()
    expect(document.querySelector('[data-region-id="narrative"]')).toBeNull()
    expect(document.querySelector('[data-region-id="overall-score"]')).toBeNull()
    expect(document.querySelector('[data-region-id="overall-state"]')).toBeNull()
  })

  it('renders gray-box placeholder copy for Regions without composed bodies', () => {
    render(<ReadingWorkspace symbol="ETH/USDT" />)

    const placeholders = screen.getAllByText(
      getMessage('readingLayout.regionPlaceholder'),
    )
    // Evidence, Market Data, Diagnostics (+ Analysis when not composed)
    expect(placeholders.length).toBeGreaterThanOrEqual(3)

    expect(regionEl('evidence')).toHaveTextContent(
      messages.readingLayout.regionPlaceholder,
    )
    expect(regionEl('market-data')).toHaveTextContent(
      messages.readingLayout.regionPlaceholder,
    )
    expect(regionEl('diagnostics')).toHaveTextContent(
      messages.readingLayout.regionPlaceholder,
    )
  })

  it('does not place Market Data in the primary Analysis workspace', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    const primaryBand = screen.getByTestId('reading-band-primary')
    const firstRegion = primaryBand.querySelector('[data-region-id]')
    expect(firstRegion).toHaveAttribute('data-region-id', 'analysis')
    expect(
      within(primaryBand).queryByText(messages.readingLayout.regionMarketData),
    ).not.toBeInTheDocument()
  })

  it('mounts Context Identity beyond a bare ticker and keeps Analysis primary', () => {
    render(<ReadingWorkspace symbol="BTC/USDT" />)

    const context = within(screen.getByTestId('reading-region-context'))
    expect(context.getByTestId('context-identity')).toBeInTheDocument()
    expect(
      context.getByText(getMessage('readingContext.displayName')),
    ).toBeInTheDocument()
    expect(
      context.getByText(
        getMessage('readingContext.symbols.BTC_USDT.displayName'),
      ),
    ).toBeInTheDocument()
    expect(context.getByText(getMessage('readingContext.pair'))).toBeInTheDocument()
    expect(context.getByText(getMessage('readingContext.base'))).toBeInTheDocument()
    expect(context.getByText(getMessage('readingContext.quote'))).toBeInTheDocument()

    expect(context.queryByText(wording.labels.price)).not.toBeInTheDocument()
    expect(
      context.queryByText(wording.labels.recommendation),
    ).not.toBeInTheDocument()
    expect(
      context.queryByText(getMessage('viewMarketData.timeframe')),
    ).not.toBeInTheDocument()

    expect(regionEl('analysis')).toHaveAttribute('data-prominence', 'primary')
    expect(regionEl('context')).not.toHaveAttribute('data-prominence', 'primary')
  })

  it('mounts Market Data body as supporting observation beside Evidence, not in the primary band', () => {
    render(
      <ReadingWorkspace
        symbol="BTC/USDT"
        regionBodies={{
          'market-data': (
            <section
              data-testid="market-data-composition"
              data-prominence="supporting"
            />
          ),
          evidence: (
            <section data-testid="evidence-composition" data-supporting="true" />
          ),
        }}
      />,
    )

    const marketData = regionEl('market-data')
    expect(marketData).toHaveAttribute('data-prominence', 'supporting')
    expect(marketData).not.toHaveAttribute('data-prominence', 'primary')
    expect(
      within(marketData).getByTestId('market-data-composition'),
    ).toBeInTheDocument()

    const evidence = regionEl('evidence')
    expect(
      within(evidence).getByTestId('evidence-composition'),
    ).toBeInTheDocument()
    expect(
      within(evidence).queryByTestId('market-data-composition'),
    ).not.toBeInTheDocument()
    expect(
      within(marketData).queryByTestId('evidence-composition'),
    ).not.toBeInTheDocument()

    const primaryBand = screen.getByTestId('reading-band-primary')
    expect(
      within(primaryBand).queryByTestId('market-data-composition'),
    ).not.toBeInTheDocument()
    expect(primaryBand.querySelector('[data-region-id]')).toHaveAttribute(
      'data-region-id',
      'analysis',
    )

    const supporting = screen.getByTestId('reading-band-supporting')
    expect(
      within(supporting).getByTestId('market-data-composition'),
    ).toBeInTheDocument()
    expect(
      within(supporting).getByTestId('evidence-composition'),
    ).toBeInTheDocument()
  })
})
