"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IngredientRowEditor } from "@/components/recetas/ingredient-row-editor"
import { recetasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Ingrediente, Categoria } from "@/lib/types"

const recetaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  instrucciones: z.string().optional(),
  categoriaId: z.coerce.number().optional(),
})

type RecetaFormData = z.infer<typeof recetaSchema>

interface RecetaIngredienteForm {
  ingredienteId: number
  cantidadNecesaria: number
}

interface RecipeCreateFormProps {
  ingredients: Ingrediente[]
  categories: Categoria[]
}

export function RecipeCreateForm({ ingredients, categories }: RecipeCreateFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [recipeIngredients, setRecipeIngredients] = useState<RecetaIngredienteForm[]>([
    { ingredienteId: 0, cantidadNecesaria: 0 },
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RecetaFormData>({
    resolver: zodResolver(recetaSchema),
  })

  const categoriaId = watch("categoriaId")

  const addIngredient = () => {
    setRecipeIngredients((prev) => [...prev, { ingredienteId: 0, cantidadNecesaria: 0 }])
  }

  const removeIngredient = (index: number) => {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, ingredienteId: number) => {
    setRecipeIngredients((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ingredienteId }
      return next
    })
  }

  const updateQuantity = (index: number, cantidad: number) => {
    setRecipeIngredients((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], cantidadNecesaria: cantidad }
      return next
    })
  }

  const onSubmit = async (data: RecetaFormData) => {
    const validIngredients = recipeIngredients.filter(
      (ingredient) => ingredient.ingredienteId > 0 && ingredient.cantidadNecesaria > 0,
    )

    if (validIngredients.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Debes agregar al menos un ingrediente válido",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const payload = {
        ...data,
        ingredientes: validIngredients.map((ingredient) => ({
          ingredienteId: ingredient.ingredienteId,
          cantidadNecesaria: ingredient.cantidadNecesaria,
        })),
      }

      await recetasApi.create(payload)

      toast({
        title: "Receta creada",
        description: "La receta se ha creado correctamente",
      })

      router.push("/recetas")
      router.refresh()
    } catch (error) {
      console.error("[app] Error creating recipe:", error)
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "No se pudo guardar la receta",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/recetas">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Recetas
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2">Nueva Receta</h1>
        <p className="text-muted-foreground">Crea una nueva receta para tu colección</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos generales de la receta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Pasta Carbonara"
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
              <Label htmlFor="categoriaId">Categoría</Label>
              <Select
                value={categoriaId?.toString() ?? ""}
                onValueChange={(value) => setValue("categoriaId", Number.parseInt(value))}
              >
                <SelectTrigger id="categoriaId" aria-label="Categoría">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Breve descripción de la receta"
                rows={3}
                {...register("descripcion")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrucciones">Instrucciones</Label>
              <Textarea
                id="instrucciones"
                placeholder="Pasos para preparar la receta"
                rows={6}
                {...register("instrucciones")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ingredientes</CardTitle>
                <CardDescription>Agrega los ingredientes necesarios</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recipeIngredients.map((ingredient, index) => (
              <IngredientRowEditor
                key={`${ingredient.ingredienteId}-${index}`}
                index={index}
                ingredienteId={ingredient.ingredienteId}
                cantidad={ingredient.cantidadNecesaria}
                availableIngredients={ingredients}
                onIngredientChange={updateIngredient}
                onQuantityChange={updateQuantity}
                onRemove={removeIngredient}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Link href="/recetas">
            <Button type="button" variant="outline" disabled={saving}>
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? "Creando..." : "Crear Receta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
