import type { CodeRegistry } from '../registry'
import { analysisCatalogEntries } from './analysis'
import { classificationCatalogEntries } from './classification'

/**
 * Frozen merged v1 Content code registry (23 analysis + classification codes).
 * Keys always equal `entry.code`.
 */
export const v1CodeRegistry: CodeRegistry = Object.freeze({
  ...analysisCatalogEntries,
  ...classificationCatalogEntries,
})

export { ANALYSIS_CODES, analysisCatalogEntries } from './analysis'
export type { AnalysisCode } from './analysis'
export {
  CLASSIFICATION_CODES,
  classificationCatalogEntries,
} from './classification'
export type { ClassificationCode } from './classification'
