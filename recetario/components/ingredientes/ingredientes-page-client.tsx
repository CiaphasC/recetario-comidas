"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IngredientFormDialog } from "@/components/ingredientes/ingredient-form-dialog"
import { IngredientsTable } from "@/components/ingredientes/ingredients-table"
import { useToast } from "@/hooks/use-toast"
import { useSelectionState } from "@/hooks/use-selection-state"
import { ingredientesApi } from "@/lib/api"
import type { Ingrediente } from "@/lib/types"

interface IngredientesPageClientProps {
  ingredients: Ingrediente[]
}

export function IngredientesPageClient({ ingredients }: IngredientesPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isOpen, selected, openCreate, openEdit, handleOpenChange, close } = useSelectionState<Ingrediente>()
  const [searchQuery, setSearchQuery] = useState("")
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [, startTransition] = useTransition()
  const [ingredientList, setIngredientList] = useState<Ingrediente[]>(ingredients)

  useEffect(() => {
    setIngredientList(ingredients)
  }, [ingredients])

  const filteredIngredients = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) {
      return ingredientList
    }

    return ingredientList.filter((ingredient) => ingredient.nombre.toLowerCase().includes(term))
  }, [ingredientList, searchQuery])

  const handleDelete = async (id: number) => {
    setProcessingId(id)
    try {
      await ingredientesApi.delete(id)
      setIngredientList((current) => current.filter((ingredient) => ingredient.id !== id))
      toast({
        title: "Ingrediente eliminado",
        description: "El ingrediente se ha eliminado correctamente",
      })
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("[app] Error deleting ingredient:", error)
      toast({
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "No se pudo eliminar el ingrediente",
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

  const handleSuccess = (result: Ingrediente, mode: "create" | "update") => {
    setIngredientList((current) => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Ingredientes</h1>
          <p className="text-muted-foreground">Gestiona tu inventario de ingredientes</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ingrediente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ingredientes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
            aria-label="Buscar ingredientes"
          />
        </div>
      </div>

      <IngredientsTable
        ingredients={filteredIngredients}
        onEdit={openEdit}
        onDelete={handleDelete}
        processingId={processingId}
      />

      <IngredientFormDialog
        open={isOpen}
        onOpenChange={handleDialogChange}
        ingredient={selected}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
