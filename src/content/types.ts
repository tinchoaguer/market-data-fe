/** Closed severity vocabulary for MessageRef and registry metadata. */
export type MessageSeverity = 'info' | 'warning' | 'error'

/** Closed channel vocabulary; content-catalogs-v1 targets `ui`. */
export type MessageChannel = 'ui'

/** Expected param value kinds in registry schema metadata. */
export type CodeParamKind = 'string' | 'number' | 'boolean'

/** Interpolation values keyed by parameter name. */
export type MessageParams = Record<string, string | number | boolean>

/** Unresolved message reference (mapper / boundary input for later resolve). */
export type MessageRef = {
  code: string
  params?: MessageParams
  severity?: MessageSeverity
  channel?: MessageChannel
}

/** Opaque optional metadata bag on a resolved message. */
export type ResolvedMessageMeta = Record<string, unknown>

/** Resolved display message (output of later Content resolve). */
export type ResolvedMessage = {
  code: string
  locale: string
  text: string
  meta?: ResolvedMessageMeta
}
