import { StatementSync } from "node:sqlite"
import { db } from "../db/sqlite"

export interface CategoriaRecord {
  id_categoria: number
  nombre: string
  descripcion: string | null
}

export class CategoriasRepository {
  private readonly selectAll: StatementSync
  private readonly selectById: StatementSync
  private readonly insert: StatementSync
  private readonly updateStmt: StatementSync
  private readonly deleteStmt: StatementSync

  constructor() {
    this.selectAll = db.prepare(
      "SELECT id_categoria, nombre, descripcion FROM Categorias ORDER BY nombre COLLATE NOCASE",
    )
    this.selectById = db.prepare(
      "SELECT id_categoria, nombre, descripcion FROM Categorias WHERE id_categoria = ?",
    )
    this.insert = db.prepare("INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)")
    this.updateStmt = db.prepare(
      "UPDATE Categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
    )
    this.deleteStmt = db.prepare("DELETE FROM Categorias WHERE id_categoria = ?")
  }

  list(): CategoriaRecord[] {
    return this.selectAll.all() as CategoriaRecord[]
  }

  findById(id: number): CategoriaRecord | undefined {
    return this.selectById.get(id) as CategoriaRecord | undefined
  }

  findByName(name: string): CategoriaRecord | undefined {
    return db
      .prepare(
        "SELECT id_categoria, nombre, descripcion FROM Categorias WHERE normalize_text(nombre) = normalize_text(?)",
      )
      .get(name) as CategoriaRecord | undefined
  }

  create(input: { nombre: string; descripcion?: string | null }): CategoriaRecord {
    const descripcion = input.descripcion ?? null
    const result = this.insert.run(input.nombre, descripcion)
    const id = Number(result.lastInsertRowid)
    const created = this.findById(id)
    if (!created) {
      throw new Error("No se pudo crear la categoría")
    }
    return created
  }

  update(id: number, input: { nombre: string; descripcion?: string | null }): CategoriaRecord {
    const descripcion = input.descripcion ?? null
    const result = this.updateStmt.run(input.nombre, descripcion, id)
    if (result.changes === 0) {
      throw new Error("La categoría no existe")
    }
    const updated = this.findById(id)
    if (!updated) {
      throw new Error("No se pudo obtener la categoría actualizada")
    }
    return updated
  }

  delete(id: number): void {
    const result = this.deleteStmt.run(id)
    if (result.changes === 0) {
      throw new Error("La categoría no existe")
    }
  }
}
