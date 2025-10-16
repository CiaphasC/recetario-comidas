import { RecipesPageClient } from "@/components/recetas/recipes-page-client"
import { ErrorMessage } from "@/components/ui/error-message"
import { getRecipesPageData } from "@/lib/data"

export default async function RecetasPage() {
  try {
    const { recipes, categories } = await getRecipesPageData()
    return <RecipesPageClient recipes={recipes} categories={categories} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar las recetas"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
