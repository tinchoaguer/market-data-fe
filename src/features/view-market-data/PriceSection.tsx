import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Text,
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
        <Text as="p" size="2xl" weight="semibold" mono tabular>
          {price}
        </Text>
      </CardContent>
    </Card>
  )
}
