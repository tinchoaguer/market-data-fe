import { useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Inline,
  Stack,
  Text,
} from '@market-data/brand/ui'
import { getMessage } from '../../i18n/messages'
import { mapDiagnosticsFromAnalysis } from './mapDiagnosticsFromAnalysis'
import type {
  DiagnosticSignal,
  DiagnosticsCompositionModel,
  DiagnosticsCompositionProps,
} from './types'

function resolveModel(props: DiagnosticsCompositionProps): DiagnosticsCompositionModel {
  if (props.model != null) {
    return props.model
  }
  return mapDiagnosticsFromAnalysis(
    {
      regime: props.regime,
      risk: props.risk,
      economic: props.economic,
      exposure: props.exposure,
      recommendation: props.recommendation,
    },
    props.mappingInput,
  )
}

function statusCopy(severity: DiagnosticsCompositionModel['severity']): string {
  switch (severity) {
    case 'healthy':
      return getMessage('readingDiagnostics.statusHealthy')
    case 'qualifying':
      return getMessage('readingDiagnostics.statusQualifying')
    case 'blocking':
      return getMessage('readingDiagnostics.statusBlocking')
  }
}

function SignalList({ signals }: { signals: DiagnosticSignal[] }) {
  return (
    <Stack gap="sm" data-unit-id="diagnostics-signals" role="list">
      {signals.map((signal) => (
        <Stack
          key={signal.id}
          gap="xs"
          role="listitem"
          data-unit-id="diagnostics-signal"
          data-signal-kind={signal.kind}
          data-signal-severity={signal.severity}
        >
          <Inline gap="sm">
            <Badge variant="secondary">{signal.label}</Badge>
            {signal.detail ? (
              <Text as="span" tone="muted">
                {signal.detail}
              </Text>
            ) : null}
          </Inline>
        </Stack>
      ))}
    </Stack>
  )
}

/**
 * Diagnostics Region body: quiet when healthy, elevated when qualifying/blocking.
 * Qualifies trust only — does not own Analysis conclusions or Evidence tables.
 */
export function DiagnosticsComposition(props: DiagnosticsCompositionProps) {
  const model = resolveModel(props)
  const headingId = 'diagnostics-composition-label'
  const [detailsOpen, setDetailsOpen] = useState(false)
  const blocking = model.severity === 'blocking'
  const elevated = model.presentation === 'elevated'
  const showSignals = blocking || detailsOpen

  return (
    <section
      aria-labelledby={headingId}
      data-unit-id="diagnostics-composition"
      data-unit-role="diagnostics-composition"
      data-testid="diagnostics-composition"
      data-presentation={model.presentation}
      data-severity={model.severity}
      data-diagnostics-expanded={blocking || detailsOpen ? 'true' : 'false'}
      data-prominence="cross-cutting"
    >
      <Stack gap="md">
        {!elevated ? (
          <Card data-diagnostics-chrome="quiet">
            <CardHeader>
              <CardTitle id={headingId} data-unit-id="diagnostics-status">
                <Badge variant="secondary" data-unit-id="diagnostics-status-badge">
                  {statusCopy(model.severity)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text tone="muted">
                {getMessage('readingDiagnostics.signalPlaceholder')}
              </Text>
            </CardContent>
          </Card>
        ) : (
          <Alert
            variant={blocking ? 'destructive' : 'warning'}
            data-diagnostics-chrome="elevated"
            data-unit-id="diagnostics-status-elevated"
          >
            <AlertTitle id={headingId} data-unit-id="diagnostics-status">
              {statusCopy(model.severity)}
            </AlertTitle>
            <AlertDescription>
              <Stack gap="sm">
                {blocking ? (
                  <SignalList signals={model.signals} />
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailsOpen((open) => !open)}
                      aria-expanded={detailsOpen}
                    >
                      {detailsOpen
                        ? getMessage('readingDiagnostics.hideDetails')
                        : getMessage('readingDiagnostics.showDetails')}
                    </Button>
                    {showSignals ? <SignalList signals={model.signals} /> : null}
                  </>
                )}
              </Stack>
            </AlertDescription>
          </Alert>
        )}
      </Stack>
    </section>
  )
}
