"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IngredientRowEditor } from "@/components/recetas/ingredient-row-editor"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { recetasApi, ingredientesApi, categoriasApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Ingrediente, Categoria, Receta } from "@/lib/types"

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

export default function EditRecetaPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recipe, setRecipe] = useState<Receta | null>(null)
  const [ingredients, setIngredients] = useState<Ingrediente[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [recipeIngredients, setRecipeIngredients] = useState<RecetaIngredienteForm[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RecetaFormData>({
    resolver: zodResolver(recetaSchema),
  })

  const categoriaId = watch("categoriaId")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const recipeId = Number.parseInt(params.id as string)
        const [recipeData, ingredientsData, categoriesData] = await Promise.all([
          recetasApi.getById(recipeId),
          ingredientesApi.getAll(),
          categoriasApi.getAll(),
        ])

        setRecipe(recipeData)
        setIngredients(ingredientsData)
        setCategories(categoriesData)

        reset({
          nombre: recipeData.nombre,
          descripcion: recipeData.descripcion || "",
          instrucciones: recipeData.instrucciones || "",
          categoriaId: recipeData.categoriaId,
        })

        setRecipeIngredients(
          recipeData.ingredientes.map((ing: any) => ({
            ingredienteId: ing.ingredienteId,
            cantidadNecesaria: ing.cantidadNecesaria,
          })),
        )
      } catch (err) {
        console.error("[v0] Error fetching recipe:", err)
        setError(err instanceof Error ? err.message : "Error al cargar la receta")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, reset])

  const addIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { ingredienteId: 0, cantidadNecesaria: 0 }])
  }

  const removeIngredient = (index: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, ingredienteId: number) => {
    const updated = [...recipeIngredients]
    updated[index].ingredienteId = ingredienteId
    setRecipeIngredients(updated)
  }

  const updateQuantity = (index: number, cantidad: number) => {
    const updated = [...recipeIngredients]
    updated[index].cantidadNecesaria = cantidad
    setRecipeIngredients(updated)
  }

  const onSubmit = async (data: RecetaFormData) => {
    const validIngredients = recipeIngredients.filter((ing) => ing.ingredienteId > 0 && ing.cantidadNecesaria > 0)

    if (validIngredients.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un ingrediente válido",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const payload = {
        ...data,
        ingredientes: validIngredients.map((ing) => ({
          ingredienteId: ing.ingredienteId,
          cantidadNecesaria: ing.cantidadNecesaria,
        })),
      }

      await recetasApi.update(Number.parseInt(params.id as string), payload)

      toast({
        title: "Receta actualizada",
        description: "La receta se ha actualizado correctamente",
      })

      router.push("/recetas")
    } catch (error) {
      console.error("[v0] Error updating recipe:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar la receta",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await recetasApi.delete(Number.parseInt(params.id as string))
      toast({
        title: "Receta eliminada",
        description: "La receta se ha eliminado correctamente",
      })
      router.push("/recetas")
    } catch (error) {
      console.error("[v0] Error deleting recipe:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar la receta",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="p-8">
        <ErrorMessage message={error || "Receta no encontrada"} />
      </div>
    )
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Editar Receta</h1>
            <p className="text-muted-foreground">Modifica los datos de tu receta</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                recipe.porcentajeCompletitud === 100
                  ? "default"
                  : recipe.porcentajeCompletitud && recipe.porcentajeCompletitud >= 50
                    ? "secondary"
                    : "destructive"
              }
            >
              {recipe.porcentajeCompletitud ? `${Math.round(recipe.porcentajeCompletitud)}% Completa` : "N/A"}
            </Badge>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
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
                value={categoriaId?.toString() || ""}
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
                key={index}
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
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La receta será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
