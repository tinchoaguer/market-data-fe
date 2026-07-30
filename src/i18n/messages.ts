/**
 * Feature / app message catalogs for market-data-fe.
 * Design-system copy: import from `@maguer/market-data-brand/wording`.
 * Default locale only â€” structure is ready for additional locales later.
 */
import en from '../locales/en.json'

export const defaultLocale = 'en' as const

export type Locale = typeof defaultLocale

const catalogs = {
  en,
} as const

export type Messages = (typeof catalogs)[Locale]

type MessageNode = string | { [key: string]: MessageNode }

function getByPath(root: MessageNode, path: string): string {
  const parts = path.split('.').filter(Boolean)
  let current: MessageNode = root

  for (const part of parts) {
    if (typeof current === 'string' || current === null || !(part in current)) {
      throw new Error(`Missing message key: ${path}`)
    }
    current = current[part]
  }

  if (typeof current !== 'string') {
    throw new Error(`Message key is not a string: ${path}`)
  }

  return current
}

/** Resolve a feature/app message from the default locale catalog. */
export function getMessage(path: string, locale: Locale = defaultLocale): string {
  return getByPath(catalogs[locale] as MessageNode, path)
}

export const messages = catalogs[defaultLocale]
