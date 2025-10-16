import { IngredientesRepository } from "../infrastructure/repositories/ingredients-repository"
import {
  RecipeFilters,
  RecipesRepository,
  SaveRecipeInput,
} from "../infrastructure/repositories/recipes-repository"
import { CategoriasRepository } from "../infrastructure/repositories/categories-repository"
import { db } from "../infrastructure/db/sqlite"

export interface PossibleRecipeInput {
  ingredientTokens?: string[]
  categoria?: string
}

export interface RecipeWithDetails {
  id_receta: number
  nombre: string
  descripcion: string | null
  id_categoria: number | null
  categoria_nombre: string | null
  ingredientes: Array<{
    id_ingrediente: number
    nombre: string
    unidad_medida: string
    cantidad: number
  }>
}

export interface PossibleRecipe extends RecipeWithDetails {
  completitud: "completa" | "incompleta"
  faltantes: string[]
  ingredientesDisponibles: number
  ingredientesFaltantes: number
  porcentajeCompletitud: number
}

export class RecetasService {
  private readonly recetasRepo = new RecipesRepository()
  private readonly ingredientesRepo = new IngredientesRepository()
  private readonly categoriasRepo = new CategoriasRepository()

  list(filters: RecipeFilters = {}): RecipeWithDetails[] {
    const recetas = this.recetasRepo.list(filters)
    return recetas.map((receta) => {
      const ingredientes = this.recetasRepo.getIngredients(receta.id_receta)
      return {
        ...receta,
        ingredientes: ingredientes.map((ing) => ({
          id_ingrediente: ing.id_ingrediente,
          nombre: ing.nombre,
          unidad_medida: ing.unidad_medida,
          cantidad: ing.cantidad,
        })),
      }
    })
  }

  getById(id: number): RecipeWithDetails | undefined {
    const receta = this.recetasRepo.findById(id)
    if (!receta) return undefined
    const ingredientes = this.recetasRepo.getIngredients(id)
    return {
      ...receta,
      ingredientes: ingredientes.map((ing) => ({
        id_ingrediente: ing.id_ingrediente,
        nombre: ing.nombre,
        unidad_medida: ing.unidad_medida,
        cantidad: ing.cantidad,
      })),
    }
  }

  create(input: SaveRecipeInput): RecipeWithDetails {
    const id = this.recetasRepo.save(input)
    const receta = this.getById(id)
    if (!receta) {
      throw new Error("No se pudo obtener la receta creada")
    }
    return receta
  }

  update(id: number, input: SaveRecipeInput): RecipeWithDetails {
    this.recetasRepo.save({ ...input, id })
    const receta = this.getById(id)
    if (!receta) {
      throw new Error("No se pudo obtener la receta actualizada")
    }
    return receta
  }

  delete(id: number): void {
    this.recetasRepo.delete(id)
  }

  getPossible(input: PossibleRecipeInput): PossibleRecipe[] {
    const providedTokens = (input.ingredientTokens ?? []).map((token) => token.trim()).filter(Boolean)
    const normalizedNames = new Set<string>()
    const explicitIds = new Set<number>()

    for (const token of providedTokens) {
      const numeric = Number.parseInt(token, 10)
      if (!Number.isNaN(numeric)) {
        explicitIds.add(numeric)
      }
      normalizedNames.add(token.toLowerCase())
    }

    let categoriaId: number | undefined
    if (input.categoria) {
      const byId = Number.parseInt(input.categoria, 10)
      if (!Number.isNaN(byId)) {
        categoriaId = byId
      } else {
        const categoria = this.categoriasRepo.findByName(input.categoria)
        categoriaId = categoria?.id_categoria
      }
    }

    const recetas = this.list({ categoriaId })

    const ingredientesDisponibles = this.ingredientesRepo.list().map((ing) => ({
      id: ing.id_ingrediente,
      nombre: ing.nombre,
      unidad: ing.unidad_medida,
    }))

    const nombreToId = new Map(
      ingredientesDisponibles.map((ing) => [ing.nombre.toLowerCase(), ing.id]),
    )

    const selectedIngredientIds = new Set<number>(explicitIds)
    for (const name of normalizedNames) {
      const id = nombreToId.get(name)
      if (typeof id === "number") {
        selectedIngredientIds.add(id)
      }
    }

    const stockStmt = db.prepare(
      "SELECT id_ingrediente, IFNULL(stock_total, 0) AS stock FROM IngredientesStock",
    )
    const stockRows = stockStmt.all() as Array<{ id_ingrediente: number; stock: number }>
    const stockMap = new Map(stockRows.map((row) => [row.id_ingrediente, row.stock]))

    return recetas.map((receta) => {
      const ingredientes = receta.ingredientes
      let ingredientesDisponiblesCount = 0
      const faltantes: string[] = []

      for (const ingrediente of ingredientes) {
        const stock = stockMap.get(ingrediente.id_ingrediente) ?? 0
        const usuarioTieneIngrediente = selectedIngredientIds.has(ingrediente.id_ingrediente)
        const hayStockSuficiente = stock >= ingrediente.cantidad

        if (usuarioTieneIngrediente && hayStockSuficiente) {
          ingredientesDisponiblesCount++
        } else {
          faltantes.push(ingrediente.nombre)
        }
      }

      const totalIngredientes = ingredientes.length
      const completitud =
        ingredientesDisponiblesCount === totalIngredientes && totalIngredientes > 0
          ? "completa"
          : "incompleta"

      const porcentajeCompletitud =
        totalIngredientes === 0
          ? 0
          : Math.round((ingredientesDisponiblesCount / totalIngredientes) * 100)

      return {
        ...receta,
        completitud,
        faltantes,
        ingredientesDisponibles: ingredientesDisponiblesCount,
        ingredientesFaltantes: totalIngredientes - ingredientesDisponiblesCount,
        porcentajeCompletitud,
      }
    })
  }
}
