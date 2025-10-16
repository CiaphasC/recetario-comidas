"use client"

import { useState } from "react"
import { Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PossibleRecipeCard } from "@/components/que-puedo-cocinar/possible-recipe-card"
import { ErrorMessage } from "@/components/ui/error-message"
import { EmptyState } from "@/components/ui/empty-state"
import { MultiSelect } from "@/components/ui/multi-select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { recetasApi } from "@/lib/api"
import type { Categoria, Ingrediente, RecetaPosible } from "@/lib/types"

interface QuePuedoCocinarPageClientProps {
  ingredients: Ingrediente[]
  categories: Categoria[]
}

export function QuePuedoCocinarPageClient({ ingredients, categories }: QuePuedoCocinarPageClientProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [possibleRecipes, setPossibleRecipes] = useState<RecetaPosible[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const ingredientOptions = ingredients.map((ingredient) => ({
    value: ingredient.id.toString(),
    label: `${ingredient.nombre} (${ingredient.cantidadDisponible} ${ingredient.unidadMedida})`,
  }))

  const handleSearch = async () => {
    try {
      setSearching(true)
      setError(null)
      setHasSearched(true)

      const ingredientesParam = selectedIngredients.join(",")
      const categoriaParam = selectedCategory === "all" ? undefined : selectedCategory

      const data = await recetasApi.getPosibles(ingredientesParam, categoriaParam)

      const sorted = data.sort((recipeA: RecetaPosible, recipeB: RecetaPosible) => {
        const totalA = recipeA.ingredientesDisponibles + recipeA.ingredientesFaltantes
        const totalB = recipeB.ingredientesDisponibles + recipeB.ingredientesFaltantes
        const percentageA = totalA > 0 ? (recipeA.ingredientesDisponibles / totalA) * 100 : 0
        const percentageB = totalB > 0 ? (recipeB.ingredientesDisponibles / totalB) * 100 : 0
        return percentageB - percentageA
      })

      setPossibleRecipes(sorted)
    } catch (err) {
      console.error("[app] Error searching recipes:", err)
      setError(err instanceof Error ? err.message : "Error al buscar recetas")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">¿Qué puedo cocinar?</h1>
          </div>
        </div>
        <p className="text-muted-foreground">Descubre qué recetas puedes preparar con tus ingredientes disponibles</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Buscar Recetas</CardTitle>
          <CardDescription>Selecciona ingredientes y categoría para encontrar recetas posibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredientes Disponibles</Label>
            <MultiSelect
              options={ingredientOptions}
              selected={selectedIngredients}
              onChange={setSelectedIngredients}
              placeholder="Selecciona ingredientes..."
            />
            <p className="text-xs text-muted-foreground">
              Selecciona los ingredientes que tienes disponibles para cocinar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría (Opcional)</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" aria-label="Categoría">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} disabled={searching} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            {searching ? "Buscando..." : "Buscar Recetas"}
          </Button>
        </CardContent>
      </Card>

      {error && hasSearched && (
        <div className="mb-8">
          <ErrorMessage message={error} />
        </div>
      )}

      {hasSearched && !searching && possibleRecipes.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No se encontraron recetas"
          description="Intenta seleccionar diferentes ingredientes o ajustar los filtros"
        />
      )}

      {possibleRecipes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Recetas Encontradas ({possibleRecipes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {possibleRecipes.map((recipe, index) => (
              <PossibleRecipeCard key={recipe.id} recipe={recipe} index={index} />
            ))}
          </div>
        </div>
      )}

      {searching && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
