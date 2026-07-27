# Diagnostics UX contract (adopted)

Adopted contract for the **Diagnostics Region** and trust qualification in this frontend. Spec Writer and Implementer use this file for Diagnostics role, elevation, and anti-patterns — do not require sibling-repo brand paths.

**Topic:** Diagnostics (Reading Region; cross-cutting)  
**Fidelity:** gray-box / structural. Visual surface uses brand tokens and components. Hi-fi Figma polish is out of scope.

Companions: `knowledge/ux/reading-contract.md` (Reading Regions), `knowledge/ux/analysis-contract.md` (confidence is never an Assessment dimension), `knowledge/ux/evidence-contract.md` (do not bury hard failures only inside Evidence tables).

**Adopted:** 2026-07-27 · epic `reading-workspace-fidelity`

---

## Purpose

Diagnostics answers: **Can I trust this reading?**

It communicates confidence and data-quality status for what the Reading asserts — insufficient, partial, stale, or similar trust constraints. Diagnostics **qualify** Analysis and Classification; they do not conclude Regime / Risk / Economic / Exposure and do not issue strategy recommendations.

When Diagnostics block a conclusion, Narrative may state the limitation; the status itself remains Diagnostics.

---

## Unit → Region map

| Diagnostics unit | Spatial home | Notes |
|------------------|--------------|-------|
| Trust / data-quality status | **Diagnostics Region** | Insufficient / partial / stale (and equivalents) |
| Blocking elevation | Near affected Reading / claim | Unmistakable when blocking; not the hero message |
| Healthy quiet state | Diagnostics Region (minimal) | Present but non-competing |

Exactly one Diagnostics Region per Reading workspace (may be quiet). Confidence is never promoted to an Assessment peer dimension.

---

## Includes / excludes

| Includes | Excludes |
|----------|----------|
| Insufficient data flags | Regime / Risk / Economic / Exposure conclusions |
| Missing series / empty book conditions | Strategy recommendations / Recommendation stance |
| Stale or partial input notices | Marketing empty states as Analysis |
| Constraints that qualify Analysis or Classification | Evidence Driver/Feature/Contribution tables |

Severity may tint Narrative, but Narrative is not Diagnostics. Diagnostic plumbing codes must not be shown as primary Analysis text.

---

## Ownership boundaries

**Diagnostics owns:** trust / data-quality status chrome and blocking qualification signals.

**Diagnostics does not own:** Assessment outcomes, Recommendation, Evidence depth, Market Data, Classification signal packaging.

| Layer | Answers |
|-------|---------|
| Analysis | How should I read this Symbol? |
| Evidence | Why does this say that? |
| Diagnostics | Can I trust this reading? |

Analysis may reference Diagnostics when inputs are weak. Diagnostics must not be nested as a fifth Assessment engine inside Assessments.

---

## Hierarchy / viewport / attention

**Reading priority:** Diagnostics are **cross-cutting** — not a fixed last step of the happy-path flow.

| State | Behavior |
|-------|----------|
| Healthy | Quiet / minimal; outside primary analytical focus; do not compete with Analysis |
| Blocking or strongly qualifying | Elevate near the affected Reading / claim; unmistakable; still do not replace Analysis as the hero message |

**Scroll:** Blocking Diagnostics must not be discoverable only after scrolling past Market Data as a late epilogue.

**Sizing:** Minimal when healthy; may grow when blocking; never Extra-large primary workspace.

**Expansion:** Collapsible / contextual; expands when blocking.

---

## Critical rules

1. Diagnostics qualify; they do not conclude.
2. Quiet when healthy; elevated when blocking — without becoming the Reading’s hero message.
3. Confidence / data quality stays in Diagnostics — never an Assessment dimension.
4. Do not bury hard trust failures only inside Evidence tables.
5. Do not hide blocking Diagnostics at the end of the Reading.
6. Gray-box structure with brand tokens/components is sufficient; do not require hi-fi Figma.

---

## Anti-patterns

| Avoid | Prefer |
|-------|--------|
| Diagnostics as hero when healthy | Quiet Diagnostics |
| Confidence as Assessment dimension | Diagnostics Region |
| Blocking Diagnostics only at page end | Elevate near affected Reading |
| Diagnostic codes as Analysis primary copy | Diagnostics status + Narrative limitation when needed |
| Hard failures only inside Evidence tables | Diagnostics Region (Evidence stays explainability) |
| Diagnostics replacing Analysis conclusions | Qualify; Analysis remains the message |

---

## Figma

Structural wireframe reference (Diagnostics quiet / cross-cutting band):

https://www.figma.com/design/opTJ1E7ZHIgpLPQTw1YtKP/Reading-Layout-Wireframe?node-id=0-1

Gray-box fidelity only — no hi-fi prototype required.

---

## Provenance

Brand `visual-definitions` (Diagnostics sections in reading-model, reading-composition-model, reading-layout-blueprint/specification; Diagnostics entity in domain-language; Analysis ownership boundaries in visual-definitions/analysis/) remains the canonical source of truth. This file is an **adopted** snapshot for isolated PROJECT_ROOT work. Regenerate via `create ux features for epic reading-workspace-fidelity` (or refresh) when the SoT changes.
