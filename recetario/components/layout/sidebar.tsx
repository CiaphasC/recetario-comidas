import { ChefHat, Home, BookOpen, Package, ShoppingCart, Tag, Sparkles } from "lucide-react"
import { NavLink } from "./nav-link"

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 border-r border-border bg-card h-screen sticky top-0 flex-col shadow-sm">
      <div className="p-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <ChefHat className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Recetario</h1>
            <p className="text-sm text-muted-foreground">Gestión de cocina</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <NavLink href="/" icon={<Home className="w-5 h-5" />}>
          Dashboard
        </NavLink>
        <NavLink href="/recetas" icon={<BookOpen className="w-5 h-5" />}>
          Recetas
        </NavLink>
        <NavLink href="/ingredientes" icon={<Package className="w-5 h-5" />}>
          Ingredientes
        </NavLink>
        <NavLink href="/compras" icon={<ShoppingCart className="w-5 h-5" />}>
          Lista de Compras
        </NavLink>
        <NavLink href="/categorias" icon={<Tag className="w-5 h-5" />}>
          Categorías
        </NavLink>
        <NavLink href="/que-puedo-cocinar" icon={<Sparkles className="w-5 h-5" />}>
          ¿Qué puedo cocinar?
        </NavLink>
      </nav>

      <div className="p-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">Recetario v1.0</p>
      </div>
    </aside>
  )
}
