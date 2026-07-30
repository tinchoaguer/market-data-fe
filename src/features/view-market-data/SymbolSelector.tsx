import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '@maguer/market-data-brand/ui'
import { wording } from '@maguer/market-data-brand/wording'
import { SUPPORTED_SYMBOLS } from '../../config/symbols'

export type SymbolSelectorProps = {
  value: string | null
  onValueChange: (symbol: string) => void
  disabled?: boolean
}

export function SymbolSelector({ value, onValueChange, disabled = false }: SymbolSelectorProps) {
  return (
    <Stack gap="sm" width="narrow">
      <Label htmlFor="symbol-select">{wording.labels.symbol}</Label>
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
    </Stack>
  )
}
