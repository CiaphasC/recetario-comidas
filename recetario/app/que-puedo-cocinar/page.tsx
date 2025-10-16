import { QuePuedoCocinarPageClient } from "@/components/que-puedo-cocinar/que-puedo-cocinar-page-client"
import { ErrorMessage } from "@/components/ui/error-message"
import { getCookingHelperData } from "@/lib/data"

export default async function QuePuedoCocinarPage() {
  try {
    const { ingredients, categories } = await getCookingHelperData()
    return <QuePuedoCocinarPageClient ingredients={ingredients} categories={categories} />
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar la información inicial"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}
