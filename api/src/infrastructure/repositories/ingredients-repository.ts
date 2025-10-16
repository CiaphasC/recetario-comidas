import { StatementSync } from "node:sqlite"
import { db } from "../db/sqlite"

const baseSelect = `
  SELECT i.id_ingrediente,
         i.nombre,
         i.unidad_medida,
         IFNULL(s.stock_total, 0) AS stock_actual,
         s.ultima_actualizacion
  FROM Ingredientes i
  LEFT JOIN IngredientesStock s ON s.id_ingrediente = i.id_ingrediente
`

const selectAllSql = `
  ${baseSelect}
  ORDER BY i.nombre COLLATE NOCASE
`

const selectByIdSql = `
  ${baseSelect}
  WHERE i.id_ingrediente = ?
`

const searchSql = `
  ${baseSelect}
  WHERE normalize_text(i.nombre) LIKE normalize_text(?)
  ORDER BY i.nombre COLLATE NOCASE
`

export interface IngredientRecord {
  id_ingrediente: number
  nombre: string
  unidad_medida: string
  stock_actual: number
  ultima_actualizacion: string | null
}

export interface CreateIngredientInput {
  nombre: string
  unidad_medida: string
  cantidad_disponible?: number
}

export class IngredientesRepository {
  private readonly selectAll: StatementSync
  private readonly selectById: StatementSync
  private readonly search: StatementSync
  private readonly insert: StatementSync
  private readonly updateStmt: StatementSync
  private readonly deleteStmt: StatementSync
  private readonly setStockStmt: StatementSync

  constructor() {
    this.selectAll = db.prepare(selectAllSql)
    this.selectById = db.prepare(selectByIdSql)
    this.search = db.prepare(searchSql)
    this.insert = db.prepare(
      "INSERT INTO Ingredientes (nombre, unidad_medida) VALUES (?, ?)",
    )
    this.updateStmt = db.prepare(
      "UPDATE Ingredientes SET nombre = ?, unidad_medida = ? WHERE id_ingrediente = ?",
    )
    this.deleteStmt = db.prepare("DELETE FROM Ingredientes WHERE id_ingrediente = ?")
    this.setStockStmt = db.prepare(
      "UPDATE IngredientesStock SET stock_total = ?, ultima_actualizacion = CURRENT_TIMESTAMP WHERE id_ingrediente = ?",
    )
  }

  list(search?: string): IngredientRecord[] {
    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`
      return this.search.all(term) as IngredientRecord[]
    }
    return this.selectAll.all() as IngredientRecord[]
  }

  findById(id: number): IngredientRecord | undefined {
    return this.selectById.get(id) as IngredientRecord | undefined
  }

  create(input: CreateIngredientInput): IngredientRecord {
    const result = this.insert.run(input.nombre, input.unidad_medida)
    const id = Number(result.lastInsertRowid)
    const created = this.findById(id)
    if (!created) {
      throw new Error("No se pudo obtener el ingrediente recién creado")
    }
    return created
  }

  update(id: number, input: CreateIngredientInput): IngredientRecord {
    const result = this.updateStmt.run(input.nombre, input.unidad_medida, id)
    if (result.changes === 0) {
      throw new Error("El ingrediente no existe")
    }
    const updated = this.findById(id)
    if (!updated) {
      throw new Error("No se pudo obtener el ingrediente actualizado")
    }
    return updated
  }

  delete(id: number): void {
    const result = this.deleteStmt.run(id)
    if (result.changes === 0) {
      throw new Error("El ingrediente no existe")
    }
  }
}
