
"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CalendarRange, Pencil, Trash2, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import type { Compra } from "@/lib/types"
import { formatDecimal } from "@/lib/utils/format"
import { EmptyState } from "@/components/ui/empty-state"

interface ShoppingListProps {
  items: Compra[]
  onEdit: (item: Compra) => void
  onDelete: (id: number) => void
  processingId?: number | null
}

export function ShoppingList({ items, onEdit, onDelete, processingId }: ShoppingListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.fechaCompra === b.fechaCompra) {
          return b.id - a.id
        }
        return a.fechaCompra < b.fechaCompra ? 1 : -1
      }),
    [items],
  )

  if (sortedItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Sin compras registradas"
        description="Registra tus compras para llevar control sobre tus ingredientes."
      />
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Compras recientes ({sortedItems.length})
          </h2>
          <div className="space-y-3">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.ingredienteNombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDecimal(item.cantidad)} {item.unidadMedida}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarRange className="w-4 h-4" />
                        <span>{item.fechaCompra}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={processingId === item.id}
                          onClick={() => onEdit(item)}
                          aria-label={`Editar compra de ${item.ingredienteNombre}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={processingId === item.id}
                          onClick={() => setDeleteId(item.id)}
                          aria-label={`Eliminar compra de ${item.ingredienteNombre}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar compra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro de compra se eliminará definitivamente.
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
              Eliminar compra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
