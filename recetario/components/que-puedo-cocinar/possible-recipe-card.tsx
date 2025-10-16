"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChefHat, CheckCircle, XCircle } from "lucide-react"
import type { RecetaPosible } from "@/lib/types"

interface PossibleRecipeCardProps {
  recipe: RecetaPosible
  index: number
}

export function PossibleRecipeCard({ recipe, index }: PossibleRecipeCardProps) {
  const totalIngredients = recipe.ingredientesDisponibles + recipe.ingredientesFaltantes
  const completenessPercentage = totalIngredients > 0 ? (recipe.ingredientesDisponibles / totalIngredients) * 100 : 0

  const completenessVariant =
    completenessPercentage === 100 ? "default" : completenessPercentage >= 50 ? "secondary" : "destructive"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/recetas/${recipe.id}`}>
        <Card className="hover:border-primary/50 transition-colors group h-full">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <Badge variant={completenessVariant}>{Math.round(completenessPercentage)}%</Badge>
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">{recipe.nombre}</CardTitle>
            {recipe.categoriaNombre && <CardDescription>{recipe.categoriaNombre}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {recipe.descripcion && <p className="text-sm text-muted-foreground line-clamp-2">{recipe.descripcion}</p>}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completitud</span>
                <span className="font-medium">{Math.round(completenessPercentage)}%</span>
              </div>
              <Progress value={completenessPercentage} className="h-2" />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span>{recipe.ingredientesDisponibles} disponibles</span>
              </div>
              {recipe.ingredientesFaltantes > 0 && (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{recipe.ingredientesFaltantes} faltantes</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
