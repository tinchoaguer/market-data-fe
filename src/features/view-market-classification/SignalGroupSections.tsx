import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  SectionHeading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import type { ClassificationSignal } from '../../api/marketClassification/types'

export type SignalGroupSectionProps = {
  title: string
  signals: ClassificationSignal[]
}

export function SignalGroupSection({ title, signals }: SignalGroupSectionProps) {
  return (
    <Card>
      <CardHeader>
        <SectionHeading>{title}</SectionHeading>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getMessage('viewMarketClassification.source')}</TableHead>
              <TableHead>{getMessage('viewMarketClassification.score')}</TableHead>
              <TableHead>{getMessage('viewMarketClassification.reason')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.map((signal, index) => (
              <TableRow key={`${signal.source}-${index}`}>
                <TableCell>{signal.source}</TableCell>
                <TableCell variant="mono">{signal.score}</TableCell>
                <TableCell>{signal.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function RegimeSignalsSection({
  signals,
}: {
  signals: ClassificationSignal[]
}) {
  return <SignalGroupSection title={wording.labels.regime} signals={signals} />
}

export function RiskSignalsSection({
  signals,
}: {
  signals: ClassificationSignal[]
}) {
  return <SignalGroupSection title={wording.labels.risk} signals={signals} />
}

export function EconomicSignalsSection({
  signals,
}: {
  signals: ClassificationSignal[]
}) {
  return (
    <SignalGroupSection title={wording.labels.economic} signals={signals} />
  )
}

export function ExposureSignalsSection({
  signals,
}: {
  signals: ClassificationSignal[]
}) {
  return (
    <SignalGroupSection title={wording.labels.exposure} signals={signals} />
  )
}
