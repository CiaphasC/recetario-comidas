"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IngredientChip } from "./ingredient-chip"
import type { Receta } from "@/lib/types"
import { ChefHat } from "lucide-react"

interface RecipeCardProps {
  recipe: Receta
  index: number
}

export function RecipeCard({ recipe, index }: RecipeCardProps) {
  const completenessVariant =
    recipe.porcentajeCompletitud === 100
      ? "default"
      : recipe.porcentajeCompletitud && recipe.porcentajeCompletitud >= 50
        ? "secondary"
        : "destructive"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/recetas/${recipe.id}`}>
        <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 group h-full shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-primary" />
              </div>
              <Badge variant={completenessVariant}>
                {recipe.porcentajeCompletitud ? `${Math.round(recipe.porcentajeCompletitud)}%` : "N/A"}
              </Badge>
            </div>
            <CardTitle className="group-hover:text-primary transition-colors text-xl font-serif">
              {recipe.nombre}
            </CardTitle>
            {recipe.categoriaNombre && (
              <CardDescription className="text-sm mt-1">{recipe.categoriaNombre}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {recipe.descripcion && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{recipe.descripcion}</p>
            )}
            {recipe.ingredientes && recipe.ingredientes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.ingredientes.slice(0, 3).map((ing, idx) => (
                  <IngredientChip
                    key={idx}
                    nombre={ing.ingredienteNombre || ""}
                    cantidad={ing.cantidadNecesaria}
                    unidad={ing.unidadMedida || ""}
                  />
                ))}
                {recipe.ingredientes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{recipe.ingredientes.length - 3} más
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
