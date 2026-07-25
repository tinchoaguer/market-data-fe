import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Page,
  PageEyebrow,
  PageHeader,
  Skeleton,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { fetchMarketAnalysis } from '../../api/marketAnalysis/fetchMarketAnalysis'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { getMessage } from '../../i18n/messages'
import { SymbolSelector } from '../view-market-data/SymbolSelector'
import {
  EconomicSection,
  RegimeSection,
  RiskSection,
} from '../view-market-analysis/AssessmentSections'
import { ExposureSection } from '../view-market-analysis/ExposureSection'
import { RecommendationSection } from '../view-market-analysis/RecommendationSection'
import { ReadingWorkspace } from './ReadingWorkspace'

type ScreenState =
  | { status: 'idle' }
  | { status: 'loading'; symbol: string }
  | { status: 'success'; symbol: string; data: MarketAnalysisViewModel }
  | { status: 'error'; symbol: string }

export type ReadingScreenProps = {
  /** Optional override for tests. Defaults to fetchMarketAnalysis. */
  loadReading?: typeof fetchMarketAnalysis
}

function AnalysisRegionBody({ data }: { data: MarketAnalysisViewModel }): ReactNode {
  return (
    <Stack gap="lg">
      <RegimeSection assessment={data.regime} />
      <RiskSection assessment={data.risk} />
      <EconomicSection assessment={data.economic} />
      <ExposureSection exposure={data.exposure} />
      <RecommendationSection recommendation={data.recommendation} />
    </Stack>
  )
}

/**
 * Symbol Reading surface host: selection, status chrome, and Reading workspace shell.
 */
export function ReadingScreen({
  loadReading = fetchMarketAnalysis,
}: ReadingScreenProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [retryNonce, setRetryNonce] = useState(0)
  const [state, setState] = useState<ScreenState>({ status: 'idle' })
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (selectedSymbol === null) {
      setState({ status: 'idle' })
      return
    }

    const symbol = selectedSymbol
    const requestId = ++requestIdRef.current
    const controller = new AbortController()

    setState({ status: 'loading', symbol })

    void loadReading(symbol, { signal: controller.signal })
      .then((data) => {
        if (requestId !== requestIdRef.current) {
          return
        }
        setState({ status: 'success', symbol, data })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ status: 'error', symbol })
      })

    return () => {
      controller.abort()
    }
  }, [selectedSymbol, retryNonce, loadReading])

  function handleRetry() {
    setRetryNonce((value) => value + 1)
  }

  return (
    <Page>
      <PageHeader>
        <PageEyebrow>{wording.product.nameShort}</PageEyebrow>
      </PageHeader>

      <SymbolSelector
        value={selectedSymbol}
        onValueChange={setSelectedSymbol}
      />

      {state.status === 'idle' ? (
        <Text tone="muted">{getMessage('readingLayout.selectSymbolPrompt')}</Text>
      ) : null}

      {state.status === 'loading' ? (
        <Stack gap="md" role="status" aria-live="polite">
          <Text>{wording.common.loading}</Text>
          <Skeleton size="card" />
          <Skeleton size="panel" />
        </Stack>
      ) : null}

      {state.status === 'error' ? (
        <Alert variant="destructive">
          <AlertTitle>{wording.common.error}</AlertTitle>
          <AlertDescription>
            <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
              {wording.common.retry}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {state.status === 'success' ? (
        <ReadingWorkspace
          symbol={state.symbol}
          regionBodies={{
            analysis: <AnalysisRegionBody data={state.data} />,
          }}
        />
      ) : null}
    </Page>
  )
}
