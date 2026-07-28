# Review Report — reading-market-data-body

```yaml
feature:
  slug: reading-market-data-body

decision: APPROVED

summary: >
  Market Data Region body is complete per approved requirements/design/tasks.
  Composition renders Price, Order book Bids/Asks, and Candles grouped by
  timeframe from reused MarketDataViewModel; supporting prominence and band
  placement are preserved in the Reading shell; Evidence kinds/labels are
  absent; chrome uses @market-data/brand primitives and catalog copy. Tests
  pass with strong structural/value oracles aligned to testing-policy.md.

requirements:
  - id: REQ-001
    status: pass
    notes: PriceObservation binds data.price; shell success test shows 42000 under Market Data Region.
  - id: REQ-002
    status: pass
    notes: OrderBookObservation renders Bids and Asks tables/empty structure from orderBook.bids/asks.
  - id: REQ-003
    status: pass
    notes: CandlesObservation groups candlesByTimeframe under Candles with data-unit-id=candles-timeframe.
  - id: REQ-004
    status: pass
    notes: Region prominence=supporting; composition data-prominence=supporting; Analysis remains sole primary.
  - id: REQ-005
    status: pass
    notes: Document order Context→Analysis→…→Market Data; Market Data not in primary band (Evidence|Market Data supporting row).
  - id: REQ-006
    status: pass
    notes: Separate region id/label; body has no Drivers/Features/Contributions kinds; Evidence remains sibling Region.
  - id: REQ-007
    status: pass
    notes: No Evidence labeling of Price/Order book/Candles; tests assert absence of readingEvidence.* in body.
  - id: REQ-008
    status: pass
    notes: Timeframe only under Candles (viewMarketData.timeframe); Context tests assert timeframe absent.
  - id: REQ-009
    status: pass
    notes: Stack/Card/Table/Badge/SectionHeading/Text from @market-data/brand/ui; no Tailwind className; section landmarks allowed.
  - id: REQ-010
    status: pass
    notes: Domain labels from brand wording; empty/placeholder from readingMarketData.* / viewMarketData.timeframe via getMessage.
  - id: REQ-011
    status: pass
    notes: Mounted as regionBodies['market-data'] in ReadingScreen; READING_REGIONS map unchanged.
  - id: REQ-012
    status: pass
    notes: Body owns only observation sections; Analysis/Evidence/Diagnostics/Classification remain other features.
  - id: REQ-013
    status: pass
    notes: MarketDataBody only when status=success and marketData!=null; idle/loading/error use host chrome (no false success body).
  - id: REQ-014
    status: pass
    notes: Binds existing MarketDataViewModel via fetchMarketData; no new API/OpenAPI.
  - id: REQ-015
    status: pass
    notes: Empty bids/asks/candle series keep labeled structure and empty messages; not treated as error.
  - id: REQ-016
    status: pass
    notes: Supporting band + supporting prominence; not Market-Data-first; Analysis remains primary interpretive Region.
  - id: NFR-001
    status: pass
    notes: React/TS feature module under Vite app.
  - id: NFR-002
    status: pass
    notes: Brand UI + wording consumed; no local token fork.
  - id: NFR-003
    status: pass
    notes: Canonical labels Price/Order book/Bids/Asks/Candles/Market Data; no Ticker/Orderbook/Candlesticks primary labels.
  - id: NFR-004
    status: pass
    notes: Locale English is sentence-case, calm, data-first (emptyBids/emptyAsks/emptyCandles/sectionPlaceholder).
  - id: NFR-005
    status: pass
    notes: Feature keys in src/locales/en.json; shared labels from brand wording; readable via getMessage.
  - id: NFR-006
    status: pass
    notes: Brand primitives used for Card/Table/Badge/Stack/Text roles; no native select/button stand-ins.
  - id: NFR-007
    status: pass
    notes: Gray-box tabular/list candles and bordered observation Cards; no hi-fi gate.
  - id: NFR-008
    status: pass
    notes: Scoped to market-data-fe; reading/evidence contracts only.
  - id: NFR-009
    status: pass
    notes: Reuses GET /markets/{symbol}/market-data mapping from view-market-data.

acceptance_criteria:
  - criterion: AC-001 Market Data Region displays current Price for the selected Symbol.
    status: pass
    notes: Fixture price under unit price + wording.labels.price; shell wires loadMarketData → MarketDataBody.
  - criterion: AC-002 Market Data Region displays Order book Bids and Asks.
    status: pass
    notes: Bids/Asks labels + level values; empty structure messages when empty.
  - criterion: AC-003 Market Data Region displays Candles grouped by timeframe.
    status: pass
    notes: Two timeframe groups (1m/1h) with candle values under Candles.
  - criterion: AC-004 Market Data remains supporting — not primary and not first in primary interpretive band.
    status: pass
    notes: Shell + body prominence/supporting-band asserts; primary band starts with Analysis.
  - criterion: AC-005 Market Data visually distinct from Evidence (observation ≠ explainability).
    status: pass
    notes: Separate Regions side-by-side; no Evidence kinds in Market Data body.
  - criterion: AC-006 Region body uses brand tokens/components already available to the FE.
    status: pass
    notes: Reviewer verified brand/ui imports and absence of ad-hoc Tailwind chrome.
  - criterion: AC-007 User-facing strings from locale catalogs / brand wording, not hardcoded English.
    status: pass
    notes: Rendered labels resolve via wording/getMessage; no hardcoded designed English in MarketDataBody.tsx.

findings:
  - severity: recommendation
    location: src/features/reading-market-data-body/MarketDataBody.test.tsx
    description: >
      A few tautological identity expects (getByText === getByText; messages
      object equality) are weak alone, but each AC already has strong value/
      structure oracles in the same suite — optional cleanup only.
    related_req: REQ-010
  - severity: recommendation
    location: src/features/reading-market-data-body/MarketDataBody.tsx (LevelsTable)
    description: >
      Quantity column header remains aria-hidden empty, matching view-market-data
      OrderBookSection. Harmless for gray-box acceptance; improve if brand adds
      a quantity wording key later.
    related_req: REQ-002

tasks_verified:
  - task: Add/reuse feature locale keys (readingMarketData.* / viewMarketData.timeframe) in en.json
    status: done
  - task: Create Market Data body module with Price / Order book / Candles structure using brand UI
    status: done
  - task: Bind MarketDataViewModel fields; empty arrays remain labeled structure
    status: done
  - task: Enforce supporting-observation rules (not primary; timeframe under Candles; no Evidence kinds)
    status: done
  - task: Mount composition in Reading layout shell Market Data Region without redefining Region map
    status: done
  - task: Defer idle/loading/error to Reading host
    status: done
  - task: Catalog-linked user-facing strings (brand wording + feature locale)
    status: done
  - task: Composition tests for Price/Bids/Asks/Candles/empty/Evidence absence
    status: done
  - task: Extend shell/host tests for supporting placement and Evidence distinctness
    status: done
```

**Test evidence:** `vitest run` on `MarketDataBody.test.tsx`, `ReadingScreen.test.tsx`, and `ReadingWorkspace.test.tsx` — 25/25 passed.
