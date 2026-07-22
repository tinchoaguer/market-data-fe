import { describe, expect, it } from 'vitest'
import { v1CodeRegistry } from '../catalogs'
import { enUiTemplates } from './en/ui'

describe('en/ui templates ↔ v1CodeRegistry bi-inclusion', () => {
  it('gives every registry code a non-empty en/ui template', () => {
    for (const code of Object.keys(v1CodeRegistry)) {
      const template = enUiTemplates[code]
      expect(template, `missing template for ${code}`).toBeTypeOf('string')
      expect(template!.trim().length).toBeGreaterThan(0)
    }
  })

  it('includes only registry codes as template keys', () => {
    for (const code of Object.keys(enUiTemplates)) {
      expect(
        Object.prototype.hasOwnProperty.call(v1CodeRegistry, code),
        `template key not in registry: ${code}`,
      ).toBe(true)
    }
  })

  it('matches registry and template key sets exactly', () => {
    expect(Object.keys(enUiTemplates).sort()).toEqual(
      Object.keys(v1CodeRegistry).sort(),
    )
  })
})
