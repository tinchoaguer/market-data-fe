import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Page,
  PageEyebrow,
  PageHeader,
  PageTitle,
  Skeleton,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { fetchMarketClassification } from '../../api/marketClassification/fetchMarketClassification'
import type { MarketClassificationViewModel } from '../../api/marketClassification/types'
import { getMessage } from '../../i18n/messages'
import { SymbolSelector } from '../view-market-data/SymbolSelector'
import {
  EconomicSignalsSection,
  ExposureSignalsSection,
  RegimeSignalsSection,
  RiskSignalsSection,
} from './SignalGroupSections'

type ScreenState =
  | { status: 'idle' }
  | { status: 'loading'; symbol: string }
  | { status: 'success'; symbol: string; data: MarketClassificationViewModel }
  | { status: 'error'; symbol: string }

export type MarketClassificationScreenProps = {
  /** Optional override for tests. Defaults to fetchMarketClassification. */
  loadMarketClassification?: typeof fetchMarketClassification
}

export function MarketClassificationScreen({
  loadMarketClassification = fetchMarketClassification,
}: MarketClassificationScreenProps) {
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

    void loadMarketClassification(symbol, { signal: controller.signal })
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
  }, [selectedSymbol, retryNonce, loadMarketClassification])

  function handleRetry() {
    setRetryNonce((value) => value + 1)
  }

  return (
    <Page>
      <PageHeader>
        <PageEyebrow>{wording.product.nameShort}</PageEyebrow>
        <PageTitle>{getMessage('viewMarketClassification.title')}</PageTitle>
      </PageHeader>

      <SymbolSelector
        value={selectedSymbol}
        onValueChange={setSelectedSymbol}
      />

      {state.status === 'idle' ? (
        <Text tone="muted">{getMessage('viewMarketClassification.empty')}</Text>
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
        <Stack gap="lg">
          <RegimeSignalsSection signals={state.data.regime} />
          <RiskSignalsSection signals={state.data.risk} />
          <EconomicSignalsSection signals={state.data.economic} />
          <ExposureSignalsSection signals={state.data.exposure} />
        </Stack>
      ) : null}
    </Page>
  )
}
