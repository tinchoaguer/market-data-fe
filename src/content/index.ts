/**
 * Content module public barrel.
 * Contracts, v1 catalogs, and in-process resolve — no brand wording.
 */

export type {
  MessageSeverity,
  MessageChannel,
  CodeParamKind,
  MessageParams,
  MessageRef,
  ResolvedMessageMeta,
  ResolvedMessage,
} from './types'

export type {
  CodeParamSchema,
  CodeRegistryEntry,
  CodeRegistry,
} from './registry'

export { emptyCodeRegistry } from './registry'

export { v1CodeRegistry } from './catalogs'

export {
  resolve,
  interpolateTemplate,
  formatParamNumber,
  DEFAULT_LOCALE,
} from './resolve'
export type { ResolveFallbackReason } from './resolve'
