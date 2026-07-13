export const DESTINATIONS = [
  'market-data',
  'analysis',
  'classification',
] as const

export type DestinationId = (typeof DESTINATIONS)[number]

export const DEFAULT_DESTINATION: DestinationId = 'market-data'

export function isDestinationId(value: string): value is DestinationId {
  return (DESTINATIONS as readonly string[]).includes(value)
}
