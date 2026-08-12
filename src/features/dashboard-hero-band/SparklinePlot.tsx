type SparklinePlotProps = {
  points: number[]
}

const PLOT_WIDTH = 320
const PLOT_HEIGHT = 64
const PLOT_PAD = 4

/**
 * Consumer-owned sparkline geometry inside brand ChartFrame.
 * Stroke/fill use published `--chart-*` tokens (NFR-011).
 */
export function SparklinePlot({ points }: SparklinePlotProps) {
  if (points.length === 0) {
    return null
  }

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const usableHeight = PLOT_HEIGHT - PLOT_PAD * 2

  const coords = points.map((value, index) => {
    const x =
      points.length === 1
        ? PLOT_WIDTH / 2
        : (index / (points.length - 1)) * PLOT_WIDTH
    const y = PLOT_HEIGHT - PLOT_PAD - ((value - min) / range) * usableHeight
    return { x, y }
  })

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const first = coords[0]
  const last = coords[coords.length - 1]
  const areaPath =
    first != null && last != null
      ? `${linePath} L ${last.x} ${PLOT_HEIGHT} L ${first.x} ${PLOT_HEIGHT} Z`
      : linePath

  return (
    <svg
      viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-testid="hero-sparkline-plot"
    >
      <path d={areaPath} fill="var(--chart-sparkline-fill)" />
      <path
        d={linePath}
        fill="none"
        stroke="var(--chart-sparkline-stroke)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
