"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFormDialog } from "@/components/categorias/category-form-dialog"
import { CategoriesGrid } from "@/components/categorias/categories-grid"
import { useToast } from "@/hooks/use-toast"
import { useSelectionState } from "@/hooks/use-selection-state"
import { categoriasApi } from "@/lib/api"
import type { Categoria } from "@/lib/types"

interface CategoriasPageClientProps {
  categories: Categoria[]
}

export function CategoriasPageClient({ categories }: CategoriasPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isOpen, selected, openCreate, openEdit, handleOpenChange, close } = useSelectionState<Categoria>()
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [, startTransition] = useTransition()
  const [categoryList, setCategoryList] = useState<Categoria[]>(categories)

  useEffect(() => {
    setCategoryList(categories)
  }, [categories])

  const handleDelete = async (id: number) => {
    setProcessingId(id)
    try {
      await categoriasApi.delete(id)
      setCategoryList((current) => current.filter((category) => category.id !== id))
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado correctamente",
      })
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("[app] Error deleting category:", error)
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoría",
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

  const handleSuccess = (result: Categoria, mode: "create" | "update") => {
    setCategoryList((current) => {
      if (mode === "create") {
        return [result, ...current]
      }
      return current.map((item) => (item.id === result.id ? result : item))
    })
    close()
    startTransition(() => router.refresh())
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Categorías</h1>
          <p className="text-muted-foreground">Organiza tus recetas por categorías</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <CategoriesGrid categories={categoryList} onEdit={openEdit} onDelete={handleDelete} processingId={processingId} />

      <CategoryFormDialog
        open={isOpen}
        onOpenChange={handleDialogChange}
        category={selected}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
