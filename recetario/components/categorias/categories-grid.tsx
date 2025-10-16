"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import type { Categoria } from "@/lib/types"
import { EmptyState } from "@/components/ui/empty-state"

interface CategoriesGridProps {
  categories: Categoria[]
  onEdit: (category: Categoria) => void
  onDelete: (id: number) => void
  processingId?: number | null
}

export function CategoriesGrid({ categories, onEdit, onDelete, processingId }: CategoriesGridProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  if (categories.length === 0) {
    return (
      <EmptyState icon={Tag} title="No hay categorías" description="Crea categorías para organizar mejor tus recetas" />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.nombre}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={processingId === category.id}
                      onClick={() => onEdit(category)}
                      aria-label={`Editar ${category.nombre}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={processingId === category.id}
                      onClick={() => setDeleteId(category.id)}
                      aria-label={`Eliminar ${category.nombre}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {category.descripcion && (
                <CardContent>
                  <CardDescription className="text-sm">{category.descripcion}</CardDescription>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={processingId === deleteId}
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
