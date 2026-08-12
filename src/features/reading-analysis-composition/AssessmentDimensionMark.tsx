import { Text } from '@maguer/market-data-brand/ui'
import type { AssessmentPeerId } from './types'

type AssessmentDimensionMarkProps = {
  dimension: AssessmentPeerId
}

const VIEWBOX = '0 0 24 24'

/**
 * Decorative dimension identity mark (NFR-011). Brand kit has no Icon primitive.
 * Accessible name stays on the dimension text label.
 */
export function AssessmentDimensionMark({
  dimension,
}: AssessmentDimensionMarkProps) {
  return (
    <Text
      as="div"
      tone="muted"
      data-card-slot="icon"
      data-dimension-mark={dimension}
      aria-hidden="true"
    >
      <svg
        width={24}
        height={24}
        viewBox={VIEWBOX}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {dimension === 'regime' ? (
          <polyline points="4 16 9 11 13 14 20 7" />
        ) : null}
        {dimension === 'risk' ? (
          <polygon points="12 3 21 19 3 19" />
        ) : null}
        {dimension === 'economic' ? (
          <>
            <rect x="4" y="12" width="4" height="8" />
            <rect x="10" y="7" width="4" height="13" />
            <rect x="16" y="3" width="4" height="17" />
          </>
        ) : null}
        {dimension === 'exposure' ? (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l3 2" />
          </>
        ) : null}
      </svg>
    </Text>
  )
}
