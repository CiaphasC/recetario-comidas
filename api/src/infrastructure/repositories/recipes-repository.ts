import { StatementSync } from "node:sqlite"
import { db } from "../db/sqlite"

export interface RecipeRecord {
  id_receta: number
  nombre: string
  descripcion: string | null
  id_categoria: number | null
  categoria_nombre: string | null
}

export interface RecipeIngredientRecord {
  id_receta: number
  id_ingrediente: number
  cantidad: number
  nombre: string
  unidad_medida: string
}

export interface RecipeFilters {
  search?: string
  categoriaId?: number
}

export interface SaveRecipeInput {
  nombre: string
  descripcion?: string | null
  id_categoria?: number | null
  ingredientes: Array<{
    id_ingrediente: number
    cantidad: number
  }>
}

const baseSelect = `
  SELECT r.id_receta,
         r.nombre,
         r.descripcion,
         r.id_categoria,
         c.nombre AS categoria_nombre
  FROM Recetas r
  LEFT JOIN Categorias c ON c.id_categoria = r.id_categoria
`

const selectIngredients = `
  SELECT ir.id_receta,
         ir.id_ingrediente,
         ir.cantidad,
         i.nombre,
         i.unidad_medida
  FROM Ingredientes_Recetas ir
  JOIN Ingredientes i ON i.id_ingrediente = ir.id_ingrediente
  WHERE ir.id_receta = ?
  ORDER BY i.nombre COLLATE NOCASE
`

export class RecipesRepository {
  private readonly selectAllStmt: StatementSync
  private readonly selectByIdStmt: StatementSync
  private readonly selectIngredientsStmt: StatementSync
  private readonly deleteIngredientsStmt: StatementSync
  private readonly insertIngredientStmt: StatementSync
  private readonly insertRecipeStmt: StatementSync
  private readonly updateRecipeStmt: StatementSync
  private readonly deleteRecipeStmt: StatementSync

  constructor() {
    this.selectAllStmt = db.prepare(`${baseSelect} ORDER BY r.nombre COLLATE NOCASE`)
    this.selectByIdStmt = db.prepare(`${baseSelect} WHERE r.id_receta = ?`)
    this.selectIngredientsStmt = db.prepare(selectIngredients)
    this.deleteIngredientsStmt = db.prepare(
      "DELETE FROM Ingredientes_Recetas WHERE id_receta = ?",
    )
    this.insertIngredientStmt = db.prepare(
      "INSERT INTO Ingredientes_Recetas (id_receta, id_ingrediente, cantidad) VALUES (?, ?, ?)",
    )
    this.insertRecipeStmt = db.prepare(
      "INSERT INTO Recetas (nombre, descripcion, id_categoria) VALUES (?, ?, ?)",
    )
    this.updateRecipeStmt = db.prepare(
      "UPDATE Recetas SET nombre = ?, descripcion = ?, id_categoria = ? WHERE id_receta = ?",
    )
    this.deleteRecipeStmt = db.prepare("DELETE FROM Recetas WHERE id_receta = ?")
  }

  list(filters: RecipeFilters = {}): RecipeRecord[] {
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters.search && filters.search.trim() !== "") {
      conditions.push("normalize_text(r.nombre) LIKE normalize_text(?)")
      params.push(`%${filters.search}%`)
    }

    if (typeof filters.categoriaId === "number") {
      conditions.push("r.id_categoria = ?")
      params.push(filters.categoriaId)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
    const stmt = db.prepare(`${baseSelect} ${whereClause} ORDER BY r.nombre COLLATE NOCASE`)
    return stmt.all(...params) as RecipeRecord[]
  }

  findById(id: number): RecipeRecord | undefined {
    return this.selectByIdStmt.get(id) as RecipeRecord | undefined
  }

  getIngredients(recetaId: number): RecipeIngredientRecord[] {
    return this.selectIngredientsStmt.all(recetaId) as RecipeIngredientRecord[]
  }

  save(input: SaveRecipeInput & { id?: number }): number {
    db.exec("BEGIN")
    try {
      let recetaId: number
      if (input.id) {
        this.updateRecipeStmt.run(
          input.nombre,
          input.descripcion ?? null,
          input.id_categoria ?? null,
          input.id,
        )
        this.deleteIngredientsStmt.run(input.id)
        for (const ingrediente of input.ingredientes) {
          this.insertIngredientStmt.run(input.id, ingrediente.id_ingrediente, ingrediente.cantidad)
        }
        recetaId = input.id
      } else {
        const result = this.insertRecipeStmt.run(
          input.nombre,
          input.descripcion ?? null,
          input.id_categoria ?? null,
        )
        recetaId = Number(result.lastInsertRowid)
        for (const ingrediente of input.ingredientes) {
          this.insertIngredientStmt.run(recetaId, ingrediente.id_ingrediente, ingrediente.cantidad)
        }
      }
      db.exec("COMMIT")
      return recetaId
    } catch (error) {
      db.exec("ROLLBACK")
      throw error
    }
  }

  delete(id: number): void {
    const result = this.deleteRecipeStmt.run(id)
    if (result.changes === 0) {
      throw new Error("La receta no existe")
    }
  }
}

