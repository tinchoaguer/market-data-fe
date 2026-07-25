export const REGION_IDS = [
  'context',
  'analysis',
  'classification',
  'evidence',
  'market-data',
  'diagnostics',
] as const

export type RegionId = (typeof REGION_IDS)[number]

export type RegionBand = 'primary' | 'associated' | 'supporting' | 'cross-cutting'

/** Relative interpretive prominence. Only Analysis is `primary`. */
export type RegionProminence =
  | 'primary'
  | 'associated'
  | 'supporting'
  | 'cross-cutting'

export type RegionDefinition = {
  id: RegionId
  labelKey: string
  /** Layout band for document structure (primary band hosts Context + Analysis). */
  band: RegionBand
  prominence: RegionProminence
}

/** Stable Region model for the Symbol Reading workspace (document order). */
export const READING_REGIONS: readonly RegionDefinition[] = [
  {
    id: 'context',
    labelKey: 'readingLayout.regionContext',
    band: 'primary',
    prominence: 'supporting',
  },
  {
    id: 'analysis',
    labelKey: 'readingLayout.regionAnalysis',
    band: 'primary',
    prominence: 'primary',
  },
  {
    id: 'classification',
    labelKey: 'readingLayout.regionClassification',
    band: 'associated',
    prominence: 'associated',
  },
  {
    id: 'evidence',
    labelKey: 'readingLayout.regionEvidence',
    band: 'supporting',
    prominence: 'supporting',
  },
  {
    id: 'market-data',
    labelKey: 'readingLayout.regionMarketData',
    band: 'supporting',
    prominence: 'supporting',
  },
  {
    id: 'diagnostics',
    labelKey: 'readingLayout.regionDiagnostics',
    band: 'cross-cutting',
    prominence: 'cross-cutting',
  },
] as const
