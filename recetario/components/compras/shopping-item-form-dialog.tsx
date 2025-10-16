
"use client"

import { useEffect, useMemo, useState } from "react"
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
import { comprasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Compra, Ingrediente } from "@/lib/types"

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD")

const compraSchema = z.object({
  ingredienteId: z.coerce.number().min(1, "Debes seleccionar un ingrediente"),
  cantidad: z.coerce.number().min(0.01, "La cantidad debe ser mayor a 0"),
  fechaCompra: isoDateSchema,
})

type CompraFormData = z.infer<typeof compraSchema>

interface ShoppingItemFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: Compra | null
  availableIngredients: Ingrediente[]
  onSuccess: (result: Compra, mode: "create" | "update") => void
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ShoppingItemFormDialog({
  open,
  onOpenChange,
  item,
  availableIngredients,
  onSuccess,
}: ShoppingItemFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompraFormData>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      ingredienteId: 0,
      cantidad: 0,
      fechaCompra: todayISO(),
    },
  })

  const ingredienteId = watch("ingredienteId")
  const selectedIngredient = useMemo(
    () => availableIngredients.find((ingredient) => ingredient.id === ingredienteId),
    [availableIngredients, ingredienteId],
  )

  useEffect(() => {
    if (item) {
      reset({
        ingredienteId: item.ingredienteId,
        cantidad: item.cantidad,
        fechaCompra: item.fechaCompra,
      })
    } else {
      reset({
        ingredienteId: 0,
        cantidad: 0,
        fechaCompra: todayISO(),
      })
    }
  }, [item, reset])

  const onSubmit = async (data: CompraFormData) => {
    try {
      setLoading(true)

      if (item) {
        const updated = await comprasApi.update(item.id, {
          ingredienteId: data.ingredienteId,
          cantidad: data.cantidad,
          fechaCompra: data.fechaCompra,
        })
        toast({
          title: "Compra actualizada",
          description: "Se actualizaron los datos de la compra.",
        })
        onSuccess(updated, "update")
      } else {
        const created = await comprasApi.create({
          ingredienteId: data.ingredienteId,
          cantidad: data.cantidad,
          fechaCompra: data.fechaCompra,
        })
        toast({
          title: "Compra registrada",
          description: "La compra se registró correctamente.",
        })
        onSuccess(created, "create")
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error guardando compra", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la compra",
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
          <DialogTitle>{item ? "Editar compra" : "Registrar compra"}</DialogTitle>
          <DialogDescription>
            {item ? "Actualiza los detalles de la compra seleccionada." : "Completa los datos para registrar una compra."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredienteId">Ingrediente *</Label>
            <Select
              value={ingredienteId ? ingredienteId.toString() : ""}
              onValueChange={(value) => setValue("ingredienteId", Number.parseInt(value))}
            >
              <SelectTrigger id="ingredienteId" aria-label="Ingrediente">
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
            {errors.ingredienteId && <p className="text-sm text-destructive">{errors.ingredienteId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaCompra">Fecha de compra *</Label>
            <Input
              id="fechaCompra"
              type="date"
              max={todayISO()}
              {...register("fechaCompra")}
              aria-invalid={!!errors.fechaCompra}
              aria-describedby={errors.fechaCompra ? "fecha-error" : undefined}
            />
            {errors.fechaCompra && (
              <p id="fecha-error" className="text-sm text-destructive">
                {errors.fechaCompra.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cantidad"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("cantidad")}
                aria-invalid={!!errors.cantidad}
                aria-describedby={errors.cantidad ? "cantidad-error" : undefined}
                className="flex-1"
              />
              {selectedIngredient && (
                <span className="text-sm text-muted-foreground min-w-16 text-right">
                  {selectedIngredient.unidadMedida}
                </span>
              )}
            </div>
            {errors.cantidad && (
              <p id="cantidad-error" className="text-sm text-destructive">
                {errors.cantidad.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : item ? "Actualizar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
