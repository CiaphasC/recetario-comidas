"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Ingrediente } from "@/lib/types"

interface IngredientRowEditorProps {
  index: number
  ingredienteId: number
  cantidad: number
  availableIngredients: Ingrediente[]
  onIngredientChange: (index: number, ingredienteId: number) => void
  onQuantityChange: (index: number, cantidad: number) => void
  onRemove: (index: number) => void
}

export function IngredientRowEditor({
  index,
  ingredienteId,
  cantidad,
  availableIngredients,
  onIngredientChange,
  onQuantityChange,
  onRemove,
}: IngredientRowEditorProps) {
  const selectedIngredient = availableIngredients.find((i) => i.id === ingredienteId)

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 space-y-2">
        <Select
          value={ingredienteId.toString()}
          onValueChange={(value) => onIngredientChange(index, Number.parseInt(value))}
        >
          <SelectTrigger aria-label={`Ingrediente ${index + 1}`}>
            <SelectValue placeholder="Selecciona un ingrediente" />
          </SelectTrigger>
          <SelectContent>
            {availableIngredients.map((ingredient) => (
              <SelectItem key={ingredient.id} value={ingredient.id.toString()}>
                {ingredient.nombre} ({ingredient.unidadMedida})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-32 space-y-2">
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={cantidad}
          onChange={(e) => onQuantityChange(index, Number.parseFloat(e.target.value) || 0)}
          placeholder="Cantidad"
          aria-label={`Cantidad de ${selectedIngredient?.nombre || "ingrediente"}`}
        />
        {selectedIngredient && (
          <p className="text-xs text-muted-foreground text-center">{selectedIngredient.unidadMedida}</p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        aria-label={`Eliminar ${selectedIngredient?.nombre || "ingrediente"}`}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
