import { wording } from '@market-data/brand/wording'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  SectionHeading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import type { ExposureProfile } from '../../api/marketAnalysis/types'

export type ExposureSectionProps = {
  exposure: ExposureProfile
}

export function ExposureSection({ exposure }: ExposureSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{wording.labels.exposure}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="md">
          <Stack gap="sm">
            <Label>{getMessage('viewMarketAnalysis.summary')}</Label>
            <Text as="p" tone="muted" mono tabular>
              {exposure.summary}
            </Text>
          </Stack>

          <Stack gap="sm">
            <SectionHeading>{getMessage('viewMarketAnalysis.factors')}</SectionHeading>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{getMessage('viewMarketAnalysis.factorName')}</TableHead>
                  <TableHead>{getMessage('viewMarketAnalysis.factorWeight')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exposure.factors.map((factor, index) => (
                  <TableRow key={`${factor.name}-${index}`}>
                    <TableCell>{factor.name}</TableCell>
                    <TableCell variant="mono">{factor.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
