import { describe, expect, it } from 'vitest'
import { getMessage } from '../../i18n/messages'
import {
  composeSymbolIdentity,
  toSymbolCatalogKey,
} from './composeSymbolIdentity'

describe('composeSymbolIdentity', () => {
  it('derives pairForm, base, and quote from slash pair Symbols', () => {
    const identity = composeSymbolIdentity('BTC/USDT')

    expect(identity.symbol).toBe('BTC/USDT')
    expect(identity.pairForm).toBe('BTC/USDT')
    expect(identity.base).toBe('BTC')
    expect(identity.quote).toBe('USDT')
  })

  it('normalizes hyphen pair Symbols to slash pairForm with base and quote', () => {
    const identity = composeSymbolIdentity('BTC-USDT')

    expect(identity.symbol).toBe('BTC-USDT')
    expect(identity.pairForm).toBe('BTC/USDT')
    expect(identity.base).toBe('BTC')
    expect(identity.quote).toBe('USDT')
  })

  it('resolves catalog displayName via getMessage for supported Symbols', () => {
    const identity = composeSymbolIdentity('BTC/USDT')

    expect(toSymbolCatalogKey('BTC/USDT')).toBe('BTC_USDT')
    expect(identity.displayName).toBe(
      getMessage('readingContext.symbols.BTC_USDT.displayName'),
    )
  })

  it('omits displayName on catalog miss while still producing pair Identity', () => {
    const identity = composeSymbolIdentity('SOL/USDT')

    expect(identity.displayName).toBeNull()
    expect(identity.pairForm).toBe('SOL/USDT')
    expect(identity.base).toBe('SOL')
    expect(identity.quote).toBe('USDT')
  })

  it('includes venue when provided and omits it when absent', () => {
    expect(composeSymbolIdentity('BTC/USDT').venue).toBeNull()
    expect(composeSymbolIdentity('BTC/USDT', { venue: null }).venue).toBeNull()
    expect(composeSymbolIdentity('BTC/USDT', { venue: '   ' }).venue).toBeNull()
    expect(composeSymbolIdentity('BTC/USDT', { venue: 'Binance' }).venue).toBe(
      'Binance',
    )
  })
})
