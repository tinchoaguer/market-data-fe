import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SectionHeading,
  Stack,
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
      <CardContent>
        <Stack gap="xl">
          {series.map((group) => (
            <section
              key={group.timeframe}
              aria-label={`${timeframeLabel} ${group.timeframe}`}
            >
              <SectionHeading spacing="md">
                <span>{timeframeLabel}</span>
                <span aria-hidden="true">: </span>
                <span>{group.timeframe}</span>
              </SectionHeading>
              <Table>
                <TableBody>
                  {group.candles.map((candle, index) => (
                    <TableRow
                      key={`${group.timeframe}-${candle.timestamp}-${index}`}
                    >
                      <TableCell variant="mono-xs">{candle.timestamp}</TableCell>
                      <TableCell variant="mono">{candle.open}</TableCell>
                      <TableCell variant="mono">{candle.high}</TableCell>
                      <TableCell variant="mono">{candle.low}</TableCell>
                      <TableCell variant="mono">{candle.close}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
