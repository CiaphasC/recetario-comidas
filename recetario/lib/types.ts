export interface Ingrediente {
  id: number
  nombre: string
  unidadMedida: string
  cantidadDisponible: number
  actualizadoEn?: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface RecetaIngrediente {
  ingredienteId: number
  ingredienteNombre?: string
  unidadMedida?: string
  cantidadNecesaria: number
}

export interface Receta {
  id: number
  nombre: string
  descripcion?: string
  instrucciones?: string
  categoriaId?: number
  categoriaNombre?: string
  ingredientes: RecetaIngrediente[]
  completa?: boolean
  porcentajeCompletitud?: number
}

export interface Compra {
  id: number
  ingredienteId: number
  ingredienteNombre?: string
  cantidad: number
  unidadMedida?: string
  fechaCompra: string
}

export interface RecetaPosible extends Receta {
  ingredientesFaltantes: number
  ingredientesDisponibles: number
}

export interface DashboardStats {
  totalRecetas: number
  totalIngredientes: number
  recetasCompletas: number
  comprasRegistradas: number
}
