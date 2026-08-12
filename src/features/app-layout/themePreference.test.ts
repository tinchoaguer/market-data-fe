import { afterEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyDocumentTheme,
  readThemePreference,
  restoreDocumentTheme,
  writeThemePreference,
} from './themePreference'

describe('themePreference', () => {
  afterEach(() => {
    window.localStorage.clear()
    applyDocumentTheme(DEFAULT_THEME)
  })

  it('reads and writes the layout-owned storage key', () => {
    expect(readThemePreference()).toBeNull()
    writeThemePreference('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(readThemePreference()).toBe('light')
  })

  it('restores stored preference onto the document root', () => {
    writeThemePreference('light')
    expect(restoreDocumentTheme()).toBe('light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('falls back to brand default when storage is empty', () => {
    expect(restoreDocumentTheme()).toBe(DEFAULT_THEME)
    expect(document.documentElement).toHaveAttribute(
      'data-theme',
      DEFAULT_THEME,
    )
  })
})
