/** Sole primary Symbol-inspection destination after reading-app-navigation. */
export const PRIMARY_DESTINATION = 'reading' as const

/** Legacy peer destinations — redirect into Reading; not primary-nav selectable. */
export const LEGACY_DESTINATIONS = [
  'market-data',
  'analysis',
  'classification',
] as const

export const DESTINATIONS = [
  PRIMARY_DESTINATION,
  ...LEGACY_DESTINATIONS,
] as const

export type DestinationId = (typeof DESTINATIONS)[number]
export type PrimaryDestinationId = typeof PRIMARY_DESTINATION
export type LegacyDestinationId = (typeof LEGACY_DESTINATIONS)[number]

export const DEFAULT_DESTINATION: PrimaryDestinationId = PRIMARY_DESTINATION

export function isDestinationId(value: string): value is DestinationId {
  return (DESTINATIONS as readonly string[]).includes(value)
}

export function isLegacyDestinationId(
  value: string,
): value is LegacyDestinationId {
  return (LEGACY_DESTINATIONS as readonly string[]).includes(value)
}

/**
 * Resolves any accepted destination id (including legacy peers) to the
 * active primary surface. Legacy market-data / analysis / classification
 * redirect into Reading.
 */
export function resolveActiveDestination(
  value: string | undefined,
): PrimaryDestinationId {
  if (value === PRIMARY_DESTINATION || isLegacyDestinationId(value ?? '')) {
    return PRIMARY_DESTINATION
  }
  if (value && isDestinationId(value)) {
    return PRIMARY_DESTINATION
  }
  return DEFAULT_DESTINATION
}
