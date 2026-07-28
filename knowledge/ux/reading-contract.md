# Reading UX contract (adopted)

Adopted contract for Symbol **Reading** structure in this frontend. Spec Writer and Implementer use this file only for Reading Regions, hierarchy, and anti-patterns — do not require sibling-repo brand paths.

**Topic:** Reading  
**Fidelity for this epic:** gray-box / structural (wireframe-aligned). Visual surface uses brand tokens and components already consumed by the app. Hi-fi Figma polish is out of scope; **do not** require paid Figma, Dev Mode, or new frames.

**Adopted:** 2026-07-27 · epic `reading-workspace-fidelity` (refresh; originally epic `reading-layout`)

---

## Purpose

A Symbol Reading is an analytical workstation view for **one Symbol**. The Symbol is the only protagonist. **Analysis is the interpretive message**; Market Data and Evidence support that message — they do not replace it. Use **Symbol**, never **Asset**, as the root term.

Every score or label must be explainable through Evidence (or qualified by Diagnostics).

---

## Layer → Region map

| Layer | Role / question | Region | Notes |
|-------|-----------------|--------|-------|
| Identity | What am I looking at? | **Context Region** | Sole content of Context |
| Analysis (+ Recommendation) | How should I read this Symbol? | **Analysis Region** | Primary Region |
| Narrative | What is the message? | Analysis Region | Bound to claims; not its own Region |
| Classification | How is this Symbol tagged? | **Classification Region** | Compact; subordinate to Analysis |
| Evidence | Why does this say that? | **Evidence Region** | Attached to claims; depth expandable |
| Market Data | What is the market showing? | **Market Data Region** | Secondary exploration |
| Diagnostics | Can I trust this reading? | **Diagnostics Region** | Cross-cutting; contextual |

---

## Regions (responsibilities)

### Context Region
- Contains Identity only (display name, base/quote, venue/pair form — not price, scores, or signals).
- Always visible; persistent; frames the reading.
- Must not compete with Analysis for message prominence.

### Analysis Region
- Primary Region of every Reading.
- Contains Analysis (Regime, Risk, Economic, Exposure, Recommendation) and Narrative bound to those claims.
- Always visible; persistent; highest prominence.
- Recommendation is not a separate Region. Narrative is not a detached Region.

### Classification Region
- Discrete signal packaging of the same four axes as Analysis (Regime / Risk / Economic / Exposure).
- Compact and subordinate; never equal prominence to Analysis.
- Sibling of Analysis — not a child and not a substitute.

### Evidence Region
- Drivers → Features → Contributions attached to a claim (Analysis, optionally Classification).
- Secondary; expandable by depth (Drivers first).
- Never free-floating metrics unrelated to a claim.
- Detail contract: `knowledge/ux/evidence-contract.md`. Assessment `components` / exposure `factors` belong here, not as Analysis-owned metric dumps.

### Market Data Region
- Price, order book, candles by timeframe — raw observation.
- Secondary; visually distinct from Evidence (observation ≠ explainability).
- Never the interpretive message.

### Diagnostics Region
- Insufficient / partial / stale (and similar) trust qualification.
- Quiet when healthy; elevated when blocking — without becoming the hero message.
- Confidence is never an Assessment dimension.
- Detail contract: `knowledge/ux/diagnostics-contract.md`.

---

## Hierarchy / viewport / attention

**Visual priority (happy path):** Identity (P0 frame) → Analysis + Recommendation (P1) → Narrative with claims (P2) → Classification (P3) → Evidence (P4) → Market Data (P5). Diagnostics are cross-cutting (elevate when blocking).

**Layout kinds:**
| Kind | Regions |
|------|---------|
| Persistent | Context, Analysis |
| Associated | Classification (adjacent to Analysis) |
| Supporting | Evidence, Market Data |
| Cross-cutting | Diagnostics |

**Relative space (allocated, not semantic rank):** Analysis extra large; Evidence large when expanded; Market Data medium; Classification small; Context small; Diagnostics minimal when healthy.

**Layout implementation (adopted — no Figma tooling):** Desktop Context strip → Analysis:~Classification **~3:1** (Classification content-sized/capped, never equal flex with Analysis) → Evidence:~Market Data **~3:2** (avoid default 50/50 equal `flex-1` walls) → Diagnostics quiet. Band gap `xl`; associated/supporting density denser than Analysis. One primary `Card` for Analysis Region; do not wrap every Region in equal Cards. Mobile (`< md`): single column in Region flow order. Full recipes SoT: brand `reading-layout-implementation.md` (refresh this snapshot when that SoT changes).

**Scroll:** Initial viewport must include enough Context + Analysis for the user to identify the Symbol and grasp the analytical conclusion **without scrolling**. Scrolling reveals depth, not the primary interpretation.

**Flow:** Context → Analysis (incl. Narrative + Recommendation) → Classification → Evidence → Market Data. Diagnostics may interrupt when trust is compromised.

---

## Critical rules

1. Exactly one Context Region and exactly one Analysis Region per Reading.
2. Interpretation before microstructure; Evidence subordinate to a claim.
3. Classification packages the same four dimensions — no Primary/Secondary Classification taxonomy, no fifth analytical engine.
4. No Overall State / Overall Score as a rollup that replaces Regime / Risk / Economic / Exposure (+ Recommendation).
5. Narrative lives with claims inside Analysis (and in Classification reasons) — never a standalone Narrative Region.
6. Market Data never becomes the primary interpretation; timeframe belongs under Candles (Market Data), not Identity.
7. Gray-box structure is sufficient: labeled region placeholders styled with brand tokens/components are acceptable; do not block on hi-fi Figma or Figma tooling.

---

## Anti-patterns

| Avoid | Prefer |
|-------|--------|
| Asset as root | Symbol |
| Equal visual weight for every Region | Analysis dominates |
| Starting with Market Data / Evidence before Analysis | Interpretation first |
| User must scroll to understand the conclusion | Context + Analysis in initial viewport |
| Classification at equal prominence to Analysis | Compact, adjacent Classification |
| Detached Evidence or Narrative Regions | Claim-attached |
| Blocking Diagnostics hidden at the end | Elevate near affected Reading |
| Overall State / Overall Score fifth engine | Four Assessments + Recommendation |
| Metrics/Observations as Evidence kinds | Drivers → Features → Contributions |

---

## Structural reference

Desktop spatial target (from brand Reading Layout Implementation): Context strip → Analysis (dominant ~3:1) + Classification (compact adjacent) → Evidence | Market Data supporting row (~3:2) → Diagnostics quiet.

Optional historical gray-box band diagram (view-only; not editable SoT; no paid Figma / Dev Mode / hi-fi required):

https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Layout harmony SoT lives in brand markdown (`reading-layout-implementation.md`), not in Figma. Iteration loop (markdown → Brand primitives only when needed → FE Reading): brand `design-to-implementation.md`.

---

## Provenance

Brand `visual-definitions` (Reading model, composition, layout blueprint/specification/**implementation**, plus shared domain language and UI philosophy) remains the canonical source of truth. This file is an **adopted** snapshot for isolated PROJECT_ROOT work. Regenerate via `create ux features for epic reading-workspace-fidelity` (or refresh) when the SoT changes.
