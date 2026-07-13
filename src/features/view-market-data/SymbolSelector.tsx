import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@market-data/brand/ui'
import { wording } from '@market-data/brand/wording'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'

export type SymbolSelectorProps = {
  value: string | null
  onValueChange: (symbol: string) => void
  disabled?: boolean
}

export function SymbolSelector({ value, onValueChange, disabled = false }: SymbolSelectorProps) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-sm font-medium text-[var(--muted-foreground)]" htmlFor="symbol-select">
        {wording.labels.symbol}
      </label>
      <Select
        value={value ?? ''}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="symbol-select" aria-label={wording.labels.symbol}>
          <SelectValue placeholder={wording.labels.symbol} />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_SYMBOLS.map((symbol) => (
            <SelectItem key={symbol} value={symbol}>
              {symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
