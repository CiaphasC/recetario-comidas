import { RecipeCreateForm } from "@/components/recetas/recipe-create-form"
import { ErrorMessage } from "@/components/ui/error-message"
import { getRecipeFormData } from "@/lib/data"

export default async function NewRecetaPage() {
  try {
    const { ingredients, categories } = await getRecipeFormData()
    return <RecipeCreateForm ingredients={ingredients} categories={categories} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar los datos necesarios"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
