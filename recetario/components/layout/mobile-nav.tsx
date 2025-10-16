"use client"

import { useState } from "react"
import { ChefHat, Home, BookOpen, Package, ShoppingCart, Tag, Sparkles, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavLink } from "./nav-link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 right-4 z-40 bg-card shadow-lg hover:bg-accent border border-border"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0 bg-white dark:bg-card border-l border-border">
        <div className="flex flex-col h-full bg-white dark:bg-card">
          <div className="p-8 border-b border-border bg-white dark:bg-card">
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

          <nav className="flex-1 p-6 space-y-2 bg-white dark:bg-card" onClick={() => setOpen(false)}>
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

          <div className="p-6 border-t border-border bg-white dark:bg-card">
            <p className="text-xs text-muted-foreground text-center">Recetario v1.0</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
