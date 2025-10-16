import { ComprasPageClient } from "@/components/compras/compras-page-client"
import { ErrorMessage } from "@/components/ui/error-message"
import { getShoppingPageData } from "@/lib/data"

export default async function ComprasPage() {
  try {
    const { items, ingredients } = await getShoppingPageData()
    return <ComprasPageClient items={items} ingredients={ingredients} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar la lista de compras"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
