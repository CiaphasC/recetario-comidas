"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { RecipeCard } from "@/components/recetas/recipe-card"
import type { Categoria, Receta } from "@/lib/types"
import { BookOpen } from "lucide-react"

interface RecipesPageClientProps {
  recipes: Receta[]
  categories: Categoria[]
}

export function RecipesPageClient({ recipes, categories }: RecipesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    if (searchQuery) {
      const normalized = searchQuery.toLowerCase()
      filtered = filtered.filter((recipe) => recipe.nombre.toLowerCase().includes(normalized))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) => recipe.categoriaId?.toString() === selectedCategory)
    }

    return filtered
  }, [recipes, searchQuery, selectedCategory])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Recetas</h1>
          <p className="text-muted-foreground">Explora y gestiona tu colección de recetas</p>
        </div>
        <Link href="/recetas/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Receta
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
            aria-label="Buscar recetas"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-64" aria-label="Filtrar por categoría">
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

      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No se encontraron recetas"
          description={
            searchQuery || selectedCategory !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primera receta"
          }
          action={
            !searchQuery && selectedCategory === "all" ? (
              <Link href="/recetas/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Receta
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
