import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@market-data/brand/ui'
import type { OrderBookLevel } from '../../api/marketData/types'

export type OrderBookSectionProps = {
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
}

function LevelsTable({
  levels,
  label,
}: {
  levels: OrderBookLevel[]
  label: string
}) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">{label}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{wording.labels.price}</TableHead>
            <TableHead aria-hidden="true" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level, index) => (
            <TableRow key={`${label}-${level.price}-${level.quantity}-${index}`}>
              <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                {level.price}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-mono)] tabular-nums">
                {level.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function OrderBookSection({ bids, asks }: OrderBookSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{wording.labels.orderBook}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 md:flex-row">
        <LevelsTable levels={bids} label={wording.labels.bids} />
        <LevelsTable levels={asks} label={wording.labels.asks} />
      </CardContent>
    </Card>
  )
}
