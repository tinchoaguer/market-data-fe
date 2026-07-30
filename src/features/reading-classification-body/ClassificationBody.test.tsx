import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { wording } from '@maguer/market-data-brand/wording'
import { resolveUiMessages } from '../../content'
import { getMessage, messages } from '../../i18n/messages'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import { ClassificationBody } from './ClassificationBody'
import { mapClassificationBody } from './mapClassificationBody'

function contentText(code: string): string {
  return resolveUiMessages([{ code }])[0]!.text
}

const emptyFixture: MarketClassificationViewModel = {
  symbol: 'BTC/USDT',
  regime: [],
  risk: [],
  economic: [],
  exposure: [],
}

const successFixture: MarketClassificationViewModel = {
  symbol: 'BTC/USDT',
  regime: [
    {
      source: 'regime',
      score: 0.92,
      reason: contentText('trend_up'),
    },
  ],
  risk: [],
  economic: [],
  exposure: [],
}

function groupEl(id: string) {
  const el = document.querySelector(`[data-unit-id="${id}"]`)
  expect(el).not.toBeNull()
  return el as HTMLElement
}

describe('ClassificationBody', () => {
  afterEach(() => {
    cleanup()
  })

  it('exposes four dimension groups including when all signal arrays are empty', () => {
    render(<ClassificationBody data={emptyFixture} />)

    const body = screen.getByTestId('classification-body')
    expect(body).toHaveAttribute('data-unit-id', 'classification-body')
    expect(body).toHaveAttribute('data-compact', 'true')
    expect(body).toHaveAttribute('data-prominence', 'associated')
    expect(body).not.toHaveAttribute('data-prominence', 'primary')

    expect(
      within(body).getByText(getMessage('readingClassification.bodyLabel')),
    ).toBe(
      within(body).getByText(messages.readingClassification.bodyLabel),
    )

    for (const id of [
      'classification-regime',
      'classification-risk',
      'classification-economic',
      'classification-exposure',
    ] as const) {
      const group = groupEl(id)
      expect(group).toHaveAttribute(
        'data-unit-role',
        'classification-dimension-group',
      )
      expect(
        within(group).getByText(getMessage('readingClassification.emptyGroup')),
      ).toBeInTheDocument()
    }

    expect(within(groupEl('classification-regime')).getByText(wording.labels.regime))
      .toBeInTheDocument()
    expect(within(groupEl('classification-risk')).getByText(wording.labels.risk))
      .toBeInTheDocument()
    expect(
      within(groupEl('classification-economic')).getByText(wording.labels.economic),
    ).toBeInTheDocument()
    expect(
      within(groupEl('classification-exposure')).getByText(wording.labels.exposure),
    ).toBeInTheDocument()

    expect(body.querySelector('[data-unit-id="classification-signal"]')).toBeNull()
    expect(screen.queryByText(/signal counts/i)).not.toBeInTheDocument()
  })

  it('packages a displayed signal with catalog-linked source, score, and reason fields', () => {
    render(<ClassificationBody data={successFixture} />)

    const regime = groupEl('classification-regime')
    expect(
      within(regime).getByText(getMessage('viewMarketClassification.source')),
    ).toBe(
      within(regime).getByText(messages.viewMarketClassification.source),
    )
    expect(
      within(regime).getByText(getMessage('viewMarketClassification.score')),
    ).toBeInTheDocument()
    expect(
      within(regime).getByText(getMessage('viewMarketClassification.reason')),
    ).toBeInTheDocument()

    expect(within(regime).getByText('regime')).toBeInTheDocument()
    expect(within(regime).getByText('0.92')).toBeInTheDocument()
    expect(within(regime).getByText(contentText('trend_up'))).toBeInTheDocument()

    const signal = regime.querySelector('[data-unit-id="classification-signal"]')
    expect(signal).not.toBeNull()
    expect(signal).toHaveAttribute('data-unit-role', 'classification-signal')

    // Empty groups remain labeled (not treated as error).
    expect(
      within(groupEl('classification-risk')).getByText(
        getMessage('readingClassification.emptyGroup'),
      ),
    ).toBeInTheDocument()

    // Not count-only packaging: field labels and reason narrative are present.
    expect(screen.queryByText('1 regime signals')).not.toBeInTheDocument()
    expect(screen.queryByText(/Signal counts/i)).not.toBeInTheDocument()
  })

  it('does not introduce Overall / Primary / Secondary Classification units', () => {
    render(<ClassificationBody data={successFixture} />)

    expect(
      document.querySelector('[data-unit-id="overall-classification"]'),
    ).toBeNull()
    expect(
      document.querySelector('[data-unit-id="primary-classification"]'),
    ).toBeNull()
    expect(
      document.querySelector('[data-unit-id="secondary-classification"]'),
    ).toBeNull()
    expect(screen.queryByText('Overall Classification')).not.toBeInTheDocument()
    expect(screen.queryByText('Primary Classification')).not.toBeInTheDocument()
    expect(screen.queryByText('Secondary Classification')).not.toBeInTheDocument()
    expect(screen.queryByText('Overall Score')).not.toBeInTheDocument()
  })

  it('maps the Classification view model into four dimension groups', () => {
    const model = mapClassificationBody(successFixture)
    expect(model.groups.map((group) => group.id)).toEqual([
      'classification-regime',
      'classification-risk',
      'classification-economic',
      'classification-exposure',
    ])
    expect(model.groups[0]?.signals).toEqual(successFixture.regime)
    expect(model.groups[1]?.signals).toEqual([])
    expect(model.groups[0]?.identityLabel).toBe(wording.labels.regime)
  })

  it('resolves Classification body chrome from feature locale keys', () => {
    expect(messages.readingClassification).toEqual({
      bodyLabel: 'Classification signals',
      emptyGroup: 'No signals for this dimension.',
    })
    expect(getMessage('readingClassification.bodyLabel')).toBe(
      messages.readingClassification.bodyLabel,
    )
    expect(getMessage('viewMarketClassification.source')).toBe(
      messages.viewMarketClassification.source,
    )
  })
})
