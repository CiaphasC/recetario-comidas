"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ingredientesApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Ingrediente } from "@/lib/types"

const ingredienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  unidadMedida: z.string().min(1, "La unidad de medida es obligatoria"),
  cantidadDisponible: z.coerce.number().min(0, "La cantidad debe ser mayor o igual a 0"),
})

type IngredienteFormData = z.infer<typeof ingredienteSchema>

interface IngredientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient?: Ingrediente | null
  onSuccess: (result: Ingrediente, mode: "create" | "update") => void
}

const UNIDADES_MEDIDA = ["kg", "g", "L", "ml", "unidad", "taza", "cucharada", "cucharadita", "pizca"]

export function IngredientFormDialog({ open, onOpenChange, ingredient, onSuccess }: IngredientFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IngredienteFormData>({
    resolver: zodResolver(ingredienteSchema),
    defaultValues: {
      nombre: "",
      unidadMedida: "g",
      cantidadDisponible: 0,
    },
  })

  const unidadMedida = watch("unidadMedida")

  useEffect(() => {
    if (ingredient) {
      reset({
        nombre: ingredient.nombre,
        unidadMedida: ingredient.unidadMedida,
        cantidadDisponible: ingredient.cantidadDisponible,
      })
    } else {
      reset({
        nombre: "",
        unidadMedida: "g",
        cantidadDisponible: 0,
      })
    }
  }, [ingredient, reset])

  const onSubmit = async (data: IngredienteFormData) => {
    try {
      setLoading(true)

      if (ingredient) {
        const updated = await ingredientesApi.update(ingredient.id, data)
        toast({
          title: "Ingrediente actualizado",
          description: "El ingrediente se ha actualizado correctamente",
        })
        onSuccess(updated, "update")
      } else {
        const created = await ingredientesApi.create(data)
        toast({
          title: "Ingrediente creado",
          description: "El ingrediente se ha creado correctamente",
        })
        onSuccess(created, "create")
      }

      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error saving ingredient:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el ingrediente",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{ingredient ? "Editar Ingrediente" : "Nuevo Ingrediente"}</DialogTitle>
          <DialogDescription>
            {ingredient ? "Modifica los datos del ingrediente" : "Agrega un nuevo ingrediente a tu inventario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Harina de trigo"
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? "nombre-error" : undefined}
            />
            {errors.nombre && (
              <p id="nombre-error" className="text-sm text-destructive">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
            <Select value={unidadMedida} onValueChange={(value) => setValue("unidadMedida", value)}>
              <SelectTrigger id="unidadMedida" aria-label="Unidad de medida">
                <SelectValue placeholder="Selecciona una unidad" />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES_MEDIDA.map((unidad) => (
                  <SelectItem key={unidad} value={unidad}>
                    {unidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unidadMedida && <p className="text-sm text-destructive">{errors.unidadMedida.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidadDisponible">Cantidad Disponible *</Label>
            <Input
              id="cantidadDisponible"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("cantidadDisponible")}
              aria-invalid={!!errors.cantidadDisponible}
              aria-describedby={errors.cantidadDisponible ? "cantidad-error" : undefined}
            />
            {errors.cantidadDisponible && (
              <p id="cantidad-error" className="text-sm text-destructive">
                {errors.cantidadDisponible.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : ingredient ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
