import { Badge } from "@/components/ui/badge"
import { formatDecimal } from "@/lib/utils/format"

interface IngredientChipProps {
  nombre: string
  cantidad?: number
  unidad: string
}

export function IngredientChip({ nombre, cantidad, unidad }: IngredientChipProps) {
  return (
    <Badge variant="secondary" className="text-xs">
      {nombre}: {formatDecimal(cantidad)} {unidad}
    </Badge>
  )
}
