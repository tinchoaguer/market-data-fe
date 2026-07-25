# Analysis UX contract (adopted)

Adopted contract for the **Analysis Region** internals in this frontend. Spec Writer and Implementer use this file for Assessment units, hierarchy, and anti-patterns inside Analysis — do not require sibling-repo brand paths.

**Topic:** Analysis (nested under Reading’s Analysis Region)  
**Fidelity for this epic:** gray-box / structural. Visual surface uses brand tokens and components. Hi-fi Figma polish is out of scope.

Companion: `knowledge/ux/reading-contract.md` owns Reading-wide Regions. This contract owns structure **inside** the Analysis Region.

---

## Purpose

Analysis answers: **How should I read this Symbol?**

It organizes interpretive knowledge into one coherent story: parallel **Assessments**, a derived **Recommendation**, and **Narrative** bound to those claims. Evidence, Diagnostics, Classification, and Market Data are referenced (Reading Regions) — not owned as Analysis content.

There is **no Overall Assessment / Overall Score** and **no Synthesis** ownership node. The four Assessment dimensions *are* the interpretation.

---

## Unit → Region map (inside Analysis)

| Analysis unit | Spatial home | Notes |
|---------------|--------------|-------|
| Assessment Dimensions (Regime, Risk, Economic, Exposure) | **Assessments Region** | Primary Region inside Analysis |
| Recommendation | Assessments Region | Not its own Region |
| Narrative | Assessments Region | Bound to each claim; not its own Region |
| Evidence | Reading Evidence Region | Attachment / reference only |
| Diagnostics | Reading Diagnostics Region | Cross-cutting attachment |
| Classification | Reading Classification Region | Sibling packaging; not nested under Analysis |
| Market Data | Reading Market Data Region | Exploration reference; not owned here |

Exactly one Assessments Region inside the Reading’s Analysis Region. No Overall Assessment Region. No Synthesis Region.

---

## Assessments Region

**Purpose:** Primary interpretation workspace.

| | |
|--|--|
| Contains | Regime, Risk, Economic, Exposure; Recommendation; Narrative bound to those claims |
| Visibility | Always visible |
| Permanence | Persistent |
| Priority | Highest inside Analysis |

### Assessment dimensions (peers)

| Dimension | Answers |
|-----------|---------|
| Regime | What market regime is this? |
| Risk | How risky is the setup? |
| Economic | Is there economic edge? |
| Exposure | How much capacity / size fits? |

Each Assessment communicates: dimension identity, outcome (label/score/level), short Narrative, path into Evidence, and Diagnostics qualification when inputs are weak.

Dimensions are **independent peers**. No dimension owns another. Contradictory dimensions stay visible — do not hide conflicts behind a rollup. Relative temporary emphasis may follow analytical strength; no dimension permanently owns Analysis.

### Recommendation

- Preferred / allowed / forbidden stance (+ hard-gate outcomes).
- Summarizes stance; does not invent new dimensional knowledge; does not justify itself (Evidence / Narrative hold justification).
- Compact relative to the Dimension collection; composed with Assessments — never a fifth Assessment engine or standalone Region.

### Narrative

- Verbal takeaway bound to Assessment or Recommendation claims.
- Reinforces; never replaces scored/labeled outcomes.
- Not a chrome-labeled detached essay Region.

---

## Hierarchy / viewport / attention (inside Analysis)

**Priority:** Assessments (P0) → Recommendation (P1) → Narrative with claims (P2) → Evidence references (P3). Diagnostics cross-cutting.

**Attention flow:** Assessment Dimensions → Recommendation → Narrative → Evidence (on demand). Diagnostics may interrupt when blocking. No Overall Assessment step; no Synthesis step.

**Scroll:** Initial viewport must show enough of the Assessments Region for dimensional interpretation **and** Recommendation **without scrolling**.

**Sizing (allocated space):** Assessments Region extra large; Dimension collection large within it; Recommendation compact; Narrative compact with claims; Evidence large only when expanded (Reading Region); Diagnostics minimal when healthy.

**Expansion:** Assessment outcomes always visible (detail may expand); Recommendation stays compact; Evidence expands Drivers → Features → Contributions; Diagnostics expand when blocking.

---

## Ownership boundaries

**Analysis owns:** Assessment dimensions, Recommendation, Narrative material bound to those claims.

**Analysis references (does not own):** Evidence, Diagnostics, Classification, Market Data.

| Layer | Answers |
|-------|---------|
| Analysis | How should I read this Symbol? |
| Evidence | Why does this say that? |
| Market Data | What is the market showing? |
| Diagnostics | Can I trust this reading? |
| Classification | How is this Symbol tagged? |

Confidence / data quality stays in Diagnostics — never an Assessment dimension.

---

## Critical rules

1. One Analysis → one Assessments Region → peer Assessment collection (currently four dimensions).
2. No Overall Assessment / Overall Score / Synthesis Region or required attention step.
3. Recommendation and Narrative live inside Assessments Region — not standalone Regions.
4. Interpretation before explanation; Evidence attached to claims, on demand.
5. Classification remains a Reading sibling — do not nest Classification essays under Analysis.
6. Extensibility: new Assessment dimensions join the peer collection without a parent rollup node.
7. Gray-box units styled with brand tokens/components are sufficient; do not require hi-fi Figma.

---

## Anti-patterns

| Avoid | Prefer |
|-------|--------|
| Overall Assessment / Overall Score as P0 | Peer Assessment dimensions as the interpretation |
| Synthesis as owned intermediate Region | Cross-dimension relationships read from Assessments |
| Standalone Recommendation or Narrative Region | Composed with Assessments / claims |
| Recommendation before Assessments | Stance after dimensional reading |
| Evidence before Assessments | Interpretation first |
| Every Dimension as a separate primary Region | One peer collection |
| Dimensions collapsed behind a rollup | Visible peer Assessments (including conflicts) |
| Confidence as an Assessment dimension | Diagnostics |
| Per-dimension mini-recommendations replacing Recommendation | One Recommendation stance |
| Embedding Evidence / Market Data inside Assessments | Attachment to Reading Regions |
| User must scroll or open every Evidence table to understand Analysis | Outcomes + Recommendation in initial viewport |

---

## Figma

Optional structural reference: paste a node-specific Figma **wireframe** URL when available. Gray-box fidelity only — no hi-fi prototype required for this contract.

---

## Provenance

Brand `visual-definitions/analysis/` (information architecture, presentation model, composition model, layout blueprint/specification) remains the canonical source of truth. This file is an **adopted** snapshot for isolated PROJECT_ROOT work. Regenerate via `create ux features for epic reading-layout` (or refresh) when the SoT changes.
