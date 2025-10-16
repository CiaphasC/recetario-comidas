import { IngredientesPageClient } from "@/components/ingredientes/ingredientes-page-client"
import { ErrorMessage } from "@/components/ui/error-message"
import { getIngredientsPageData } from "@/lib/data"

export default async function IngredientesPage() {
  try {
    const ingredients = await getIngredientsPageData()
    return <IngredientesPageClient ingredients={ingredients} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar los ingredientes"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
