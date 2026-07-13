import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Cluster,
  ClusterItem,
  SectionHeading,
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
    <ClusterItem>
      <SectionHeading>{label}</SectionHeading>
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
              <TableCell variant="mono">{level.price}</TableCell>
              <TableCell variant="mono">{level.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ClusterItem>
  )
}

export function OrderBookSection({ bids, asks }: OrderBookSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{wording.labels.orderBook}</CardTitle>
      </CardHeader>
      <CardContent>
        <Cluster>
          <LevelsTable levels={bids} label={wording.labels.bids} />
          <LevelsTable levels={asks} label={wording.labels.asks} />
        </Cluster>
      </CardContent>
    </Card>
  )
}
