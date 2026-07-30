import { useState } from 'react'
import { wording } from '@maguer/market-data-brand/wording'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Cluster,
  ClusterItem,
  Inline,
  SectionHeading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@maguer/market-data-brand/ui'
import type { CandleSeries, OrderBookLevel } from '../../api/marketData/types'
import { getMessage } from '../../i18n/messages'
import type { MarketDataBodyProps } from './types'

function LevelsTable({
  levels,
  label,
  unitId,
  emptyMessage,
}: {
  levels: OrderBookLevel[]
  label: string
  unitId: 'order-book-bids' | 'order-book-asks'
  emptyMessage: string
}) {
  return (
    <ClusterItem>
      <section
        aria-label={label}
        data-unit-id={unitId}
        data-unit-role="order-book-side"
        data-testid={unitId}
      >
        <SectionHeading>{label}</SectionHeading>
        {levels.length === 0 ? (
          <Text tone="muted">{emptyMessage}</Text>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{wording.labels.price}</TableHead>
                <TableHead aria-hidden="true" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map((level, index) => (
                <TableRow
                  key={`${unitId}-${level.price}-${level.quantity}-${index}`}
                >
                  <TableCell variant="mono">{level.price}</TableCell>
                  <TableCell variant="mono">{level.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </ClusterItem>
  )
}

function PriceObservation({ price }: { price: number }) {
  return (
    <section
      aria-label={wording.labels.price}
      data-unit-id="price"
      data-unit-role="price"
      data-testid="price"
    >
      <Card>
        <CardHeader>
          <CardTitle>{wording.labels.price}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text as="p" size="2xl" weight="semibold" mono tabular>
            {price}
          </Text>
        </CardContent>
      </Card>
    </section>
  )
}

function OrderBookObservation({
  bids,
  asks,
}: {
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
}) {
  return (
    <section
      aria-label={wording.labels.orderBook}
      data-unit-id="order-book"
      data-unit-role="order-book"
      data-testid="order-book"
    >
      <Card>
        <CardHeader>
          <CardTitle>{wording.labels.orderBook}</CardTitle>
        </CardHeader>
        <CardContent>
          <Cluster>
            <LevelsTable
              levels={bids}
              label={wording.labels.bids}
              unitId="order-book-bids"
              emptyMessage={getMessage('readingMarketData.emptyBids')}
            />
            <LevelsTable
              levels={asks}
              label={wording.labels.asks}
              unitId="order-book-asks"
              emptyMessage={getMessage('readingMarketData.emptyAsks')}
            />
          </Cluster>
        </CardContent>
      </Card>
    </section>
  )
}

function CandlesObservation({ series }: { series: CandleSeries[] }) {
  const timeframeLabel = getMessage('viewMarketData.timeframe')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <section
      aria-label={wording.labels.candles}
      data-unit-id="candles"
      data-unit-role="candles"
      data-testid="candles"
    >
      <Card>
        <CardHeader>
          <CardTitle>{wording.labels.candles}</CardTitle>
        </CardHeader>
        <CardContent>
          {series.length === 0 ? (
            <Text tone="muted">
              {getMessage('readingMarketData.sectionPlaceholder')}
            </Text>
          ) : (
            <Stack gap="md">
              {series.map((group) => {
                const isOpen = expanded[group.timeframe] === true
                const countLabel = getMessage(
                  'readingMarketData.candleCount',
                ).replace('{count}', String(group.candles.length))

                return (
                  <section
                    key={group.timeframe}
                    aria-label={`${timeframeLabel} ${group.timeframe}`}
                    data-unit-id="candles-timeframe"
                    data-unit-role="candles-timeframe"
                    data-timeframe={group.timeframe}
                    data-candles-expanded={isOpen ? 'true' : 'false'}
                  >
                    <Stack gap="sm">
                      <Inline gap="sm" wrap>
                        <SectionHeading spacing="md">
                          <span>{timeframeLabel}</span>
                          <span aria-hidden="true">: </span>
                          <Badge>{group.timeframe}</Badge>
                        </SectionHeading>
                        <Text as="span" tone="muted">
                          {countLabel}
                        </Text>
                        {group.candles.length > 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-expanded={isOpen}
                            onClick={() => {
                              setExpanded((prev) => ({
                                ...prev,
                                [group.timeframe]: !isOpen,
                              }))
                            }}
                          >
                            {isOpen
                              ? getMessage('readingMarketData.hideCandles')
                              : getMessage('readingMarketData.showCandles')}
                          </Button>
                        ) : null}
                      </Inline>
                      {group.candles.length === 0 ? (
                        <Text tone="muted">
                          {getMessage('readingMarketData.emptyCandles')}
                        </Text>
                      ) : isOpen ? (
                        <Table>
                          <TableBody>
                            {group.candles.map((candle, index) => (
                              <TableRow
                                key={`${group.timeframe}-${candle.timestamp}-${index}`}
                              >
                                <TableCell variant="mono-xs">
                                  {candle.timestamp}
                                </TableCell>
                                <TableCell variant="mono">{candle.open}</TableCell>
                                <TableCell variant="mono">{candle.high}</TableCell>
                                <TableCell variant="mono">{candle.low}</TableCell>
                                <TableCell variant="mono">{candle.close}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : null}
                    </Stack>
                  </section>
                )
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

/**
 * Market Data Region body: Price, Order book (Bids/Asks), and Candles by timeframe.
 * Supporting observation only â€” never primary interpretive content or Evidence.
 */
export function MarketDataBody({ data }: MarketDataBodyProps) {
  return (
    <section
      aria-label={getMessage('readingLayout.regionMarketData')}
      data-unit-id="market-data-composition"
      data-unit-role="market-data-composition"
      data-testid="market-data-composition"
      data-prominence="supporting"
      data-supporting="true"
    >
      <Stack gap="md">
        <PriceObservation price={data.price} />
        <OrderBookObservation
          bids={data.orderBook.bids}
          asks={data.orderBook.asks}
        />
        <CandlesObservation series={data.candlesByTimeframe} />
      </Stack>
    </section>
  )
}
