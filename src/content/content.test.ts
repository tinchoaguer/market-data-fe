import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  emptyCodeRegistry,
  resolve,
  resolveUiMessages,
  v1CodeRegistry,
  type CodeRegistryEntry,
  type MessageChannel,
  type MessageRef,
  type MessageSeverity,
  type ResolvedMessage,
} from './index'

const CONTENT_DIR = dirname(fileURLToPath(import.meta.url))

const ALLOWED_SEVERITIES: readonly MessageSeverity[] = [
  'info',
  'warning',
  'error',
]

const ALLOWED_CHANNELS: readonly MessageChannel[] = ['ui']

function listContentSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []

  for (const name of entries) {
    const fullPath = join(dir, name)
    if (statSync(fullPath).isDirectory()) {
      files.push(...listContentSourceFiles(fullPath))
      continue
    }
    if (name.endsWith('.ts') && !name.endsWith('.test.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

describe('Content module public barrel', () => {
  it('exports emptyCodeRegistry as an empty immutable object', () => {
    expect(emptyCodeRegistry).toEqual({})
    expect(Object.keys(emptyCodeRegistry)).toHaveLength(0)
    expect(Object.isFrozen(emptyCodeRegistry)).toBe(true)
  })

  it('exports v1CodeRegistry, resolve, and resolveUiMessages for later Features', () => {
    expect(Object.keys(v1CodeRegistry)).toHaveLength(23)
    expect(typeof resolve).toBe('function')
    expect(typeof resolveUiMessages).toBe('function')
    expect(
      resolve({
        locale: 'en',
        channel: 'ui',
        messages: [{ code: 'range' }],
      }),
    ).toEqual([{ code: 'range', locale: 'en', text: 'Range' }])
    expect(resolveUiMessages([{ code: 'range' }])).toEqual([
      { code: 'range', locale: 'en', text: 'Range' },
    ])
  })

  it('does not import brand wording packages from Content sources', () => {
    const sourceFiles = listContentSourceFiles(CONTENT_DIR)
    expect(sourceFiles.length).toBeGreaterThan(0)

    for (const fullPath of sourceFiles) {
      const source = readFileSync(fullPath, 'utf8')
      expect(source).not.toMatch(/@market-data\/brand(?:\/wording)?/)
    }
  })
})

describe('MessageRef contract', () => {
  it('accepts a minimal ref with only code', () => {
    const ref: MessageRef = { code: 'analysis.regime.trend_up' }

    expect(ref).toEqual({ code: 'analysis.regime.trend_up' })
    expect(ref.params).toBeUndefined()
    expect(ref.severity).toBeUndefined()
    expect(ref.channel).toBeUndefined()
  })

  it('accepts a full ref with params, severity, and channel', () => {
    const ref: MessageRef = {
      code: 'analysis.risk.score_band',
      params: { score: 42, band: 'elevated', active: true },
      severity: 'warning',
      channel: 'ui',
    }

    expect(ref.code).toBe('analysis.risk.score_band')
    expect(ref.params).toEqual({ score: 42, band: 'elevated', active: true })
    expect(ref.severity).toBe('warning')
    expect(ref.channel).toBe('ui')
    expect(ALLOWED_SEVERITIES).toContain(ref.severity)
    expect(ALLOWED_CHANNELS).toContain(ref.channel)
  })
})

describe('ResolvedMessage contract', () => {
  it('requires code, locale, and text; allows optional meta', () => {
    const minimal: ResolvedMessage = {
      code: 'analysis.regime.trend_up',
      locale: 'en',
      text: 'Uptrend conditions',
    }

    expect(minimal.code).toBe('analysis.regime.trend_up')
    expect(minimal.locale).toBe('en')
    expect(minimal.text).toBe('Uptrend conditions')
    expect(minimal.meta).toBeUndefined()

    const withMeta: ResolvedMessage = {
      ...minimal,
      meta: { severity: 'info', fallbackApplied: false },
    }

    expect(withMeta.meta).toEqual({
      severity: 'info',
      fallbackApplied: false,
    })
  })
})

describe('CodeRegistryEntry contract', () => {
  it('describes code, paramsSchema, and optional defaultSeverity', () => {
    const entry: CodeRegistryEntry = {
      code: 'analysis.risk.score_band',
      paramsSchema: [
        { name: 'score', kind: 'number', required: true },
        { name: 'band', kind: 'string', required: true },
        { name: 'active', kind: 'boolean', required: false },
      ],
      defaultSeverity: 'warning',
    }

    expect(entry.code).toBe('analysis.risk.score_band')
    expect(entry.paramsSchema).toEqual([
      { name: 'score', kind: 'number', required: true },
      { name: 'band', kind: 'string', required: true },
      { name: 'active', kind: 'boolean', required: false },
    ])
    expect(entry.defaultSeverity).toBe('warning')
    expect(ALLOWED_SEVERITIES).toContain(entry.defaultSeverity)
  })

  it('allows entries with an empty paramsSchema and no defaultSeverity', () => {
    const entry: CodeRegistryEntry = {
      code: 'analysis.regime.range',
      paramsSchema: [],
    }

    expect(entry.code).toBe('analysis.regime.range')
    expect(entry.paramsSchema).toEqual([])
    expect(entry.defaultSeverity).toBeUndefined()
  })
})

describe('Closed severity and channel unions', () => {
  it('uses the designed closed severity and channel literals', () => {
    expect(ALLOWED_SEVERITIES).toEqual(['info', 'warning', 'error'])
    expect(ALLOWED_CHANNELS).toEqual(['ui'])

    const severities: MessageSeverity[] = ['info', 'warning', 'error']
    const channels: MessageChannel[] = ['ui']

    for (const severity of severities) {
      const ref: MessageRef = { code: 'sample', severity }
      expect(ref.severity).toBe(severity)
    }

    for (const channel of channels) {
      const ref: MessageRef = { code: 'sample', channel }
      expect(ref.channel).toBe(channel)
    }
  })
})
