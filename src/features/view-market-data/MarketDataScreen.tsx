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
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { fetchMarketData } from '../../api/marketData/fetchMarketData'
import type { MarketDataViewModel } from '../../api/marketData/types'
import { getMessage } from '../../i18n/messages'
import { CandlesSection } from './CandlesSection'
import { OrderBookSection } from './OrderBookSection'
import { PriceSection } from './PriceSection'
import { SymbolSelector } from './SymbolSelector'

type ScreenState =
  | { status: 'idle' }
  | { status: 'loading'; symbol: string }
  | { status: 'success'; symbol: string; data: MarketDataViewModel }
  | { status: 'error'; symbol: string }

export type MarketDataScreenProps = {
  /** Optional override for tests. Defaults to fetchMarketData. */
  loadMarketData?: typeof fetchMarketData
}

export function MarketDataScreen({
  loadMarketData = fetchMarketData,
}: MarketDataScreenProps) {
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

    void loadMarketData(symbol, { signal: controller.signal })
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
  }, [selectedSymbol, retryNonce, loadMarketData])

  function handleRetry() {
    setRetryNonce((value) => value + 1)
  }

  return (
    <Page>
      <PageHeader>
        <PageEyebrow>{wording.product.nameShort}</PageEyebrow>
        <PageTitle>{getMessage('viewMarketData.title')}</PageTitle>
      </PageHeader>

      <SymbolSelector
        value={selectedSymbol}
        onValueChange={setSelectedSymbol}
      />

      {state.status === 'idle' ? (
        <Text tone="muted">{getMessage('viewMarketData.empty')}</Text>
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
          <PriceSection price={state.data.price} />
          <OrderBookSection bids={state.data.orderBook.bids} asks={state.data.orderBook.asks} />
          <CandlesSection series={state.data.candlesByTimeframe} />
        </Stack>
      ) : null}
    </Page>
  )
}
