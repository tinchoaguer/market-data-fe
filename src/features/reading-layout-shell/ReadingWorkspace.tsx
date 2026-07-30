import type { ReactNode } from 'react'
import { Cluster, ClusterItem, Stack } from '@maguer/market-data-brand/ui'
import { getMessage } from '../../i18n/messages'
import {
  composeSymbolIdentity,
  ContextIdentity,
} from '../reading-context-identity'
import { ReadingRegion } from './ReadingRegion'
import { READING_REGIONS, type RegionId } from './regions'

export type ReadingWorkspaceProps = {
  /** Selected Symbol identity for the Context Region. */
  symbol: string
  /** Optional venue for Identity when available on the source model. */
  venue?: string | null
  /** Optional composed bodies keyed by Region id. Unset Regions render gray-box placeholders. */
  regionBodies?: Partial<Record<RegionId, ReactNode>>
}

function regionDef(id: RegionId) {
  const region = READING_REGIONS.find((entry) => entry.id === id)
  if (!region) {
    throw new Error(`Unknown Reading Region: ${id}`)
  }
  return region
}

/**
 * Symbol Reading workspace shell: six Regions with implementation ratios
 * (Context strip â†’ Analysis majority + Classification minority â†’ Evidence majority |
 * Market Data minority â†’ Diagnostics).
 */
export function ReadingWorkspace({
  symbol,
  venue = null,
  regionBodies = {},
}: ReadingWorkspaceProps) {
  const bodies: Partial<Record<RegionId, ReactNode>> = {
    context: (
      <ContextIdentity
        identity={composeSymbolIdentity(symbol, { venue })}
      />
    ),
    ...regionBodies,
  }

  const context = regionDef('context')
  const analysis = regionDef('analysis')
  const classification = regionDef('classification')
  const evidence = regionDef('evidence')
  const marketData = regionDef('market-data')
  const diagnostics = regionDef('diagnostics')

  return (
    <Stack gap="xl" data-testid="reading-workspace">
      <Stack gap="sm" data-reading-band="context" data-testid="reading-band-context">
        <ReadingRegion
          id={context.id}
          label={getMessage(context.labelKey)}
          band={context.band}
          prominence={context.prominence}
        >
          {bodies.context}
        </ReadingRegion>
      </Stack>

      <Cluster
        data-reading-band="primary"
        data-testid="reading-band-primary"
        data-reading-row="analysis-classification"
      >
        <ClusterItem share="majority" data-reading-slot="analysis">
          <ReadingRegion
            id={analysis.id}
            label={getMessage(analysis.labelKey)}
            band={analysis.band}
            prominence={analysis.prominence}
          >
            {bodies.analysis}
          </ReadingRegion>
        </ClusterItem>
        <ClusterItem
          share="minority"
          data-reading-slot="classification"
          data-testid="reading-slot-classification"
        >
          <ReadingRegion
            id={classification.id}
            label={getMessage(classification.labelKey)}
            band={classification.band}
            prominence={classification.prominence}
          >
            {bodies.classification}
          </ReadingRegion>
        </ClusterItem>
      </Cluster>

      <Cluster
        data-reading-band="supporting"
        data-testid="reading-band-supporting"
        data-reading-row="evidence-market-data"
      >
        <ClusterItem share="majority" data-reading-slot="evidence">
          <ReadingRegion
            id={evidence.id}
            label={getMessage(evidence.labelKey)}
            band={evidence.band}
            prominence={evidence.prominence}
          >
            {bodies.evidence}
          </ReadingRegion>
        </ClusterItem>
        <ClusterItem share="minority" data-reading-slot="market-data">
          <ReadingRegion
            id={marketData.id}
            label={getMessage(marketData.labelKey)}
            band={marketData.band}
            prominence={marketData.prominence}
          >
            {bodies['market-data']}
          </ReadingRegion>
        </ClusterItem>
      </Cluster>

      <Stack gap="sm" data-reading-band="cross-cutting" data-testid="reading-band-diagnostics">
        <ReadingRegion
          id={diagnostics.id}
          label={getMessage(diagnostics.labelKey)}
          band={diagnostics.band}
          prominence={diagnostics.prominence}
        >
          {bodies.diagnostics}
        </ReadingRegion>
      </Stack>
    </Stack>
  )
}
