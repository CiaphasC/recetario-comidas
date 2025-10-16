"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShoppingList } from "@/components/compras/shopping-list"
import { ShoppingItemFormDialog } from "@/components/compras/shopping-item-form-dialog"
import { useToast } from "@/hooks/use-toast"
import { useSelectionState } from "@/hooks/use-selection-state"
import { comprasApi } from "@/lib/api"
import type { Compra, Ingrediente } from "@/lib/types"

interface ComprasPageClientProps {
  items: Compra[]
  ingredients: Ingrediente[]
}

export function ComprasPageClient({ items, ingredients }: ComprasPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isOpen, selected, openCreate, openEdit, handleOpenChange, close } = useSelectionState<Compra>()
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [, startTransition] = useTransition()
  const [purchases, setPurchases] = useState<Compra[]>(items)

  useEffect(() => {
    setPurchases(items)
  }, [items])

  const handleDelete = async (id: number) => {
    setProcessingId(id)
    try {
      await comprasApi.delete(id)
      setPurchases((current) => current.filter((item) => item.id !== id))
      toast({
        title: "Compra eliminada",
        description: "El registro de compra se eliminó correctamente.",
      })
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("Error eliminando compra", error)
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "No se pudo eliminar la compra.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDialogChange = (open: boolean) => {
    handleOpenChange(open)
    if (!open) {
      setProcessingId(null)
    }
  }

  const handleSuccess = (result: Compra, mode: "create" | "update") => {
    setPurchases((current) => {
      if (mode === "create") {
        return [result, ...current]
      }
      return current.map((item) => (item.id === result.id ? result : item))
    })
    close()
    startTransition(() => router.refresh())
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Historial de Compras</h1>
          <p className="text-muted-foreground">Registra y consulta los movimientos de tu inventario.</p>
        </div>
        <Button onClick={openCreate} aria-label="Registrar compra">
          <CalendarPlus className="w-4 h-4 mr-2" />
          Registrar compra
        </Button>
      </div>

      <ShoppingList items={purchases} onEdit={openEdit} onDelete={handleDelete} processingId={processingId} />

      <ShoppingItemFormDialog
        open={isOpen}
        onOpenChange={handleDialogChange}
        item={selected}
        availableIngredients={ingredients}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
