import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@market-data/brand/ui'

export type PriceSectionProps = {
  price: number
}

export function PriceSection({ price }: PriceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{wording.labels.price}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-[family-name:var(--font-mono)] text-2xl font-semibold tabular-nums">
          {price}
        </p>
      </CardContent>
    </Card>
  )
}
