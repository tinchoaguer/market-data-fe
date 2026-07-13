import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import type { CandleSeries } from '../../api/marketData/types'

export type CandlesSectionProps = {
  series: CandleSeries[]
}

export function CandlesSection({ series }: CandlesSectionProps) {
  const timeframeLabel = getMessage('viewMarketData.timeframe')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{wording.labels.candles}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {series.map((group) => (
          <section key={group.timeframe} aria-label={`${timeframeLabel} ${group.timeframe}`}>
            <h3 className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">
              <span>{timeframeLabel}</span>
              <span aria-hidden="true">: </span>
              <span>{group.timeframe}</span>
            </h3>
            <Table>
              <TableBody>
                {group.candles.map((candle, index) => (
                  <TableRow key={`${group.timeframe}-${candle.timestamp}-${index}`}>
                    <TableCell className="font-[family-name:var(--font-mono)] text-xs">
                      {candle.timestamp}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                      {candle.open}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                      {candle.high}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                      {candle.low}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                      {candle.close}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        ))}
      </CardContent>
    </Card>
  )
}
