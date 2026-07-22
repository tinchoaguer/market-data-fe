/**
 * Content module public barrel.
 * Contracts and registry skeleton only — no resolve API, catalogs, or brand wording.
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
