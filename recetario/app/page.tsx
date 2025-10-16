import { BookOpen, CheckCircle, Package, ShoppingCart } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentRecipes } from "@/components/dashboard/recent-recipes"
import { ErrorMessage } from "@/components/ui/error-message"
import { getDashboardData } from "@/lib/data"

export default async function DashboardPage() {
  try {
    const { stats, recentRecipes } = await getDashboardData()

    return (
      <div className="p-8 lg:p-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-3 font-serif">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Resumen de tu recetario y gestión de ingredientes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Recetas"
            value={stats.totalRecetas}
            icon={<BookOpen />}
            description="Recetas en tu colección"
            index={0}
          />
          <StatCard
            title="Ingredientes"
            value={stats.totalIngredientes}
            icon={<Package />}
            description="Ingredientes disponibles"
            index={1}
          />
          <StatCard
            title="Recetas Completas"
            value={stats.recetasCompletas}
            icon={<CheckCircle />}
            description="Listas para cocinar"
            index={2}
          />
          <StatCard
            title="Compras Registradas"
            value={stats.comprasRegistradas}
            icon={<ShoppingCart />}
            description="Movimientos de inventario"
            index={3}
          />
        </div>

        <RecentRecipes recipes={recentRecipes} />
      </div>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar los datos del dashboard"
    return (
      <div className="p-8">
        <ErrorMessage message={message} />
      </div>
    )
  }
}

