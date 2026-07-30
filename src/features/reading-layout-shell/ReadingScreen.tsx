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
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { fetchMarketAnalysis } from '../../api/marketAnalysis/fetchMarketAnalysis'
import type { MarketAnalysisViewModel } from '../../api/marketAnalysis/types'
import { fetchMarketClassification } from '../../api/marketClassification/fetchMarketClassification'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import { fetchMarketData } from '../../api/marketData/fetchMarketData'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { getMessage } from '../../i18n/messages'
import { AssessmentsWorkspace } from '../reading-analysis-composition'
import { ClassificationBody } from '../reading-classification-body'
import { DiagnosticsComposition } from '../reading-diagnostics'
import { EvidenceComposition } from '../reading-evidence-composition'
import { MarketDataBody } from '../reading-market-data-body'
import { SymbolSelector } from '../view-market-data/SymbolSelector'
import { ReadingWorkspace } from './ReadingWorkspace'

type ScreenState =
  | { status: 'idle' }
  | { status: 'loading'; symbol: string }
  | {
      status: 'success'
      symbol: string
      analysis: MarketAnalysisViewModel
      classification: MarketClassificationViewModel | null
      marketData: MarketDataViewModel | null
    }
  | { status: 'error'; symbol: string }

export type ReadingScreenProps = {
  /** Optional override for tests. Defaults to fetchMarketAnalysis. */
  loadReading?: typeof fetchMarketAnalysis
  /** Optional override for Classification Region body. */
  loadClassification?: typeof fetchMarketClassification
  /** Optional override for Market Data Region body. */
  loadMarketData?: typeof fetchMarketData
}

function AnalysisRegionBody({ data }: { data: MarketAnalysisViewModel }): ReactNode {
  const regimeNarrative = data.regime.summary.trim()
  const regimeForPeers =
    regimeNarrative.length > 0
      ? { ...data.regime, summary: '' }
      : data.regime

  return (
    <AssessmentsWorkspace
      regime={regimeForPeers}
      risk={data.risk}
      economic={data.economic}
      exposure={data.exposure}
      recommendation={data.recommendation}
      narratives={{
        ...(regimeNarrative.length > 0 ? { regime: regimeNarrative } : {}),
      }}
    />
  )
}

function EvidenceRegionBody({ data }: { data: MarketAnalysisViewModel }): ReactNode {
  return (
    <EvidenceComposition
      regime={data.regime}
      risk={data.risk}
      economic={data.economic}
      exposure={data.exposure}
      recommendation={data.recommendation}
    />
  )
}

function DiagnosticsRegionBody({
  data,
}: {
  data: MarketAnalysisViewModel
}): ReactNode {
  return (
    <DiagnosticsComposition
      regime={data.regime}
      risk={data.risk}
      economic={data.economic}
      exposure={data.exposure}
      recommendation={data.recommendation}
    />
  )
}

/**
 * Symbol Reading surface host: selection, status chrome, and Reading workspace shell.
 */
export function ReadingScreen({
  loadReading = fetchMarketAnalysis,
  loadClassification = fetchMarketClassification,
  loadMarketData = fetchMarketData,
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

    void Promise.all([
      loadReading(symbol, { signal: controller.signal }),
      loadClassification(symbol, { signal: controller.signal }).catch(() => null),
      loadMarketData(symbol, { signal: controller.signal }).catch(() => null),
    ])
      .then(([analysis, classification, marketData]) => {
        if (requestId !== requestIdRef.current) {
          return
        }
        setState({
          status: 'success',
          symbol,
          analysis,
          classification,
          marketData,
        })
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
  }, [selectedSymbol, retryNonce, loadReading, loadClassification, loadMarketData])

  function handleRetry() {
    setRetryNonce((value) => value + 1)
  }

  return (
    <Page width="full">
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
            analysis: <AnalysisRegionBody data={state.analysis} />,
            evidence: <EvidenceRegionBody data={state.analysis} />,
            diagnostics: <DiagnosticsRegionBody data={state.analysis} />,
            classification:
              state.classification != null ? (
                <ClassificationBody data={state.classification} />
              ) : undefined,
            'market-data':
              state.marketData != null ? (
                <MarketDataBody data={state.marketData} />
              ) : undefined,
          }}
        />
      ) : null}
    </Page>
  )
}
