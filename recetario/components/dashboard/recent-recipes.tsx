"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import type { Receta } from "@/lib/types"
import Link from "next/link"

interface RecentRecipesProps {
  recipes: Receta[]
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-serif">
            <BookOpen className="w-6 h-6 text-primary" />
            Recetas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recipes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No hay recetas disponibles</p>
          ) : (
            <div className="space-y-2">
              {recipes.slice(0, 5).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={`/recetas/${recipe.id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {recipe.nombre}
                      </h4>
                      {recipe.categoriaNombre && (
                        <p className="text-sm text-muted-foreground mt-1">{recipe.categoriaNombre}</p>
                      )}
                    </div>
                    <Badge
                      variant={
                        recipe.porcentajeCompletitud === 100
                          ? "default"
                          : recipe.porcentajeCompletitud && recipe.porcentajeCompletitud >= 50
                            ? "secondary"
                            : "destructive"
                      }
                      className="ml-4"
                    >
                      {recipe.porcentajeCompletitud ? `${Math.round(recipe.porcentajeCompletitud)}%` : "N/A"}
                    </Badge>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
