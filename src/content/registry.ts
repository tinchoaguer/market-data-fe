import type { CodeParamKind, MessageSeverity } from './types'

/** Per-parameter schema metadata for a catalog code. */
export type CodeParamSchema = {
  name: string
  kind: CodeParamKind
  required: boolean
}

/** One catalog registration unit (semantic code + params/severity metadata). */
export type CodeRegistryEntry = {
  code: string
  paramsSchema: CodeParamSchema[]
  defaultSeverity?: MessageSeverity
}

/**
 * Map of semantic code id → registry entry.
 * When populated later, each key MUST equal `entry.code`.
 */
export type CodeRegistry = Readonly<Record<string, CodeRegistryEntry>>

/** Empty typed registry container for later catalog Features. */
export const emptyCodeRegistry: CodeRegistry = Object.freeze({})
