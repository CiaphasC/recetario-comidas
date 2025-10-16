"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, Package } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"
import type { Ingrediente } from "@/lib/types"
import { formatDecimal } from "@/lib/utils/format"
import { EmptyState } from "@/components/ui/empty-state"

interface IngredientsTableProps {
  ingredients: Ingrediente[]
  onEdit: (ingredient: Ingrediente) => void
  onDelete: (id: number) => void
  processingId?: number | null
}

export function IngredientsTable({ ingredients, onEdit, onDelete, processingId }: IngredientsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  if (ingredients.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No hay ingredientes"
        description="Comienza agregando ingredientes a tu inventario para gestionar tus recetas"
      />
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Cantidad Disponible</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient, index) => (
              <motion.tr
                key={ingredient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <TableCell className="font-medium">{ingredient.nombre}</TableCell>
                <TableCell>
                  <Badge variant="outline">{ingredient.unidadMedida}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{formatDecimal(ingredient.cantidadDisponible)}</TableCell>
                <TableCell>
                  <Badge variant={ingredient.cantidadDisponible > 0 ? "default" : "destructive"}>
                    {ingredient.cantidadDisponible > 0 ? "Disponible" : "Agotado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={processingId === ingredient.id}
                      onClick={() => onEdit(ingredient)}
                      aria-label={`Editar ${ingredient.nombre}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={processingId === ingredient.id}
                      onClick={() => setDeleteId(ingredient.id)}
                      aria-label={`Eliminar ${ingredient.nombre}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ingrediente será eliminado permanentemente.
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
