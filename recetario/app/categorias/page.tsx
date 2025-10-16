import { CategoriasPageClient } from "@/components/categorias/categorias-page-client"
import { ErrorMessage } from "@/components/ui/error-message"
import { getCategoriesPageData } from "@/lib/data"

export default async function CategoriasPage() {
  try {
    const categories = await getCategoriesPageData()
    return <CategoriasPageClient categories={categories} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar las categorías"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
