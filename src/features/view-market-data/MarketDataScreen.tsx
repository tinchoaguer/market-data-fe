import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[var(--letter-spacing-wide)] text-[var(--muted-foreground)]">
          {wording.product.nameShort}
        </p>
        <h1 className="text-3xl font-bold tracking-[var(--letter-spacing-tight)]">
          {getMessage('viewMarketData.title')}
        </h1>
      </header>

      <SymbolSelector
        value={selectedSymbol}
        onValueChange={setSelectedSymbol}
      />

      {state.status === 'idle' ? (
        <p className="text-[var(--muted-foreground)]">{getMessage('viewMarketData.empty')}</p>
      ) : null}

      {state.status === 'loading' ? (
        <div role="status" aria-live="polite" className="flex flex-col gap-3">
          <p>{wording.common.loading}</p>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : null}

      {state.status === 'error' ? (
        <Alert variant="destructive">
          <AlertTitle>{wording.common.error}</AlertTitle>
          <AlertDescription className="mt-3">
            <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
              {wording.common.retry}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {state.status === 'success' ? (
        <div className="flex flex-col gap-6">
          <PriceSection price={state.data.price} />
          <OrderBookSection bids={state.data.orderBook.bids} asks={state.data.orderBook.asks} />
          <CandlesSection series={state.data.candlesByTimeframe} />
        </div>
      ) : null}
    </div>
  )
}
