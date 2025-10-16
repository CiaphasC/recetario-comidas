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
import { Textarea } from "@/components/ui/textarea"
import { categoriasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Categoria } from "@/lib/types"

const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
})

type CategoriaFormData = z.infer<typeof categoriaSchema>

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Categoria | null
  onSuccess: (result: Categoria, mode: "create" | "update") => void
}

export function CategoryFormDialog({ open, onOpenChange, category, onSuccess }: CategoryFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        nombre: category.nombre,
        descripcion: category.descripcion || "",
      })
    } else {
      reset({
        nombre: "",
        descripcion: "",
      })
    }
  }, [category, reset])

  const onSubmit = async (data: CategoriaFormData) => {
    try {
      setLoading(true)

      if (category) {
        const updated = await categoriasApi.update(category.id, data)
        toast({
          title: "Categoría actualizada",
          description: "La categoría se ha actualizado correctamente",
        })
        onSuccess(updated, "update")
      } else {
        const created = await categoriasApi.create(data)
        toast({
          title: "Categoría creada",
          description: "La categoría se ha creado correctamente",
        })
        onSuccess(created, "create")
      }

      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error saving category:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar la categoría",
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
          <DialogTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          <DialogDescription>
            {category ? "Modifica los datos de la categoría" : "Agrega una nueva categoría para organizar tus recetas"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Postres, Platos principales, Ensaladas"
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
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción opcional de la categoría"
              rows={3}
              {...register("descripcion")}
              aria-describedby="descripcion-help"
            />
            <p id="descripcion-help" className="text-xs text-muted-foreground">
              Opcional: Agrega una breve descripción de esta categoría
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : category ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
