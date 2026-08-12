import type { ThemeAppearance } from '@maguer/market-data-brand/ui'

/** localStorage key owned by app layout chrome. */
export const THEME_STORAGE_KEY = 'market-data-fe.theme'

/** Brand ThemeToggle default when no stored preference exists. */
export const DEFAULT_THEME: ThemeAppearance = 'dark'

export function isThemeAppearance(value: unknown): value is ThemeAppearance {
  return value === 'light' || value === 'dark'
}

/** Read persisted theme preference; returns null when missing or unreadable. */
export function readThemePreference(): ThemeAppearance | null {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeAppearance(raw) ? raw : null
  } catch {
    return null
  }
}

/** Persist theme preference; ignores storage failures (session still works). */
export function writeThemePreference(theme: ThemeAppearance): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage unavailable — keep session theme only.
  }
}

/**
 * Apply brand-documented theme attribute + color-scheme on the document root.
 * Consumers wire this around ThemeToggle; the kit does not own persistence.
 */
export function applyDocumentTheme(theme: ThemeAppearance): void {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
}

/** Resolve preference (stored or default) and apply it to the document. */
export function restoreDocumentTheme(): ThemeAppearance {
  const theme = readThemePreference() ?? DEFAULT_THEME
  applyDocumentTheme(theme)
  return theme
}
