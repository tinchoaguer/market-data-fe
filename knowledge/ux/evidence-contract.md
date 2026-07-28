# Evidence UX contract (adopted)

Adopted contract for the **Evidence Region** and claim-attached explainability in this frontend. Spec Writer and Implementer use this file for Evidence structure, ownership, and anti-patterns — do not require sibling-repo brand paths.

**Topic:** Evidence (Reading Region; referenced from Analysis / Classification claims)  
**Fidelity:** gray-box / structural. Visual surface uses brand tokens and components. Hi-fi Figma polish is out of scope; **do not** require paid Figma, Dev Mode, or new frames.

Companions: `knowledge/ux/reading-contract.md` (Reading Regions), `knowledge/ux/analysis-contract.md` (Analysis owns outcomes, not Evidence tables).

**Adopted:** 2026-07-27 · epic `reading-workspace-fidelity`

---

## Purpose

Evidence answers: **Why does this number or label say that?**

It is the explainability layer for scores and labels. Evidence is **subordinate to a claim** (an Assessment, Recommendation, or Classification signal). It is never a free-floating metrics dashboard and never the primary interpretive message (that is Analysis).

Every score or label shown under Analysis must be explainable through Evidence (or qualified by Diagnostics when it cannot be concluded).

---

## Unit → Region map

| Evidence unit | Spatial home | Notes |
|---------------|--------------|-------|
| Drivers | **Evidence Region** | Named forces behind a claim |
| Features | Evidence Region | Measured inputs behind Drivers |
| Contributions | Evidence Region | Quantified attribution toward a score |
| Claim attachment | Adjacent to Assessment / Recommendation / signal | Conceptual link; content owned by Evidence Region |
| Market Data (raw) | Reading Market Data Region | May *feed* Features only when cited — not Evidence until cited |

Exactly one Evidence Region per Reading workspace. Zero or more claim attachments. No “Metrics” or “Observations” Region as Evidence kinds.

---

## Evidence kinds (progressive disclosure)

| Kind | Role | Prominence within Evidence |
|------|------|----------------------------|
| **Drivers** | Human-facing causes that push an assessment (e.g. volatility, liquidity stress) | Highest — may surface near the claim |
| **Features** | Observable measured inputs behind Drivers (e.g. ATR expansion, book imbalance) | Secondary — on demand after Drivers |
| **Contributions** | Quantified weight of each Driver / Feature toward a score | Deepest — on demand |

**Disclosure order:** claim outcome first (Analysis) → Drivers → Features → Contributions. Users must not need Features/Contributions tables to understand the Assessment outcome.

**Payload orientation (UI model, not API map):** assessment `components` and exposure `factors` are Evidence (Drivers + Contributions). Present them in the Evidence Region (or as claim-attached Evidence depth), **not** as anonymous metric rows owned inside Assessment peer bodies.

---

## Ownership boundaries

**Evidence owns:** Drivers, Features, Contributions, and the explainability body for a claim.

**Evidence does not own:** Assessment outcomes, Recommendation stance, Narrative prose, Classification signal lists, Market Data microstructure, Diagnostics trust flags.

| Layer | Answers |
|-------|---------|
| Analysis | How should I read this Symbol? |
| Evidence | Why does this say that? |
| Market Data | What is the market showing? |
| Diagnostics | Can I trust this reading? |

Analysis may expose a **path / reference** into Evidence. Analysis must not embed full Evidence tables as the Assessment’s primary body.

---

## Hierarchy / viewport / attention

**Reading priority:** Evidence is P4 after Classification (see reading-contract). Interpretation (Assessments + Recommendation) precedes Evidence.

**Inside Evidence:** Drivers more prominent than Features and Contributions.

**Scroll:** User must understand Analysis without opening Evidence. Scrolling / expanding Evidence reveals depth.

**Sizing:** Evidence may allocate large space when expanded; default supporting. Never Extra-large primary workspace.

**Expansion:** Drivers first; Features / Contributions behind disclosure.

---

## Critical rules

1. Evidence hangs off a claim — never an independent dashboard Region with no claim context.
2. Interpretation before Evidence; Evidence never replaces Assessments as the message.
3. Use Drivers → Features → Contributions — not Metrics / Observations as kind labels.
4. Market Data is not Evidence until cited as a Feature supporting a claim.
5. Do not nest Evidence content as Analysis-owned Assessment body; move explainability into the Evidence Region (attachments allowed).
6. Gray-box structure with brand tokens/components is sufficient; do not require hi-fi Figma or Figma tooling.

---

## Anti-patterns

| Avoid | Prefer |
|-------|--------|
| Free-floating Evidence / metric wall | Claim-attached Evidence |
| Evidence before Assessments | Interpretation first |
| `components` / `factors` as Assessment-owned primary body | Evidence Region (Drivers + Contributions) |
| Metrics / Observations as Evidence kinds | Drivers → Features → Contributions |
| Market Data dump labeled as Evidence | Cite as Features only when supporting a claim |
| User must open every Evidence table to understand Analysis | Outcomes + Recommendation first; Evidence on demand |
| Embedding Evidence inside Assessments Region as owned content | Reference / attachment to Reading Evidence Region |

---

## Structural reference

Evidence is a supporting Region (Reading Layout Implementation: supporting band; typically larger share than Market Data). Optional historical gray-box band diagram (view-only; not editable SoT):

https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

---

## Provenance

Brand `visual-definitions` (Evidence sections in reading-model, reading-composition-model, reading-layout-blueprint/specification/**implementation**; Evidence entity in domain-language; Analysis ownership boundaries in visual-definitions/analysis/) remains the canonical source of truth. This file is an **adopted** snapshot for isolated PROJECT_ROOT work. Regenerate via `create ux features for epic reading-workspace-fidelity` (or refresh) when the SoT changes.
