import { StatementSync, Transaction } from "node:sqlite"
import { db } from "../db/sqlite"

export interface CompraRecord {
  id_compra: number
  id_ingrediente: number
  fecha_compra: string
  cantidad: number
  ingrediente_nombre?: string
  unidad_medida?: string
}

export interface CompraFilters {
  ingredienteId?: number
  desde?: string
  hasta?: string
}

export interface CreateCompraInput {
  id_ingrediente: number
  fecha_compra: string
  cantidad: number
}

export class ComprasRepository {
  private readonly baseSelect: string
  private readonly insert: StatementSync
  private readonly updateStmt: StatementSync
  private readonly deleteStmt: StatementSync
  private readonly selectById: StatementSync

  constructor() {
    this.baseSelect = `
      SELECT c.id_compra,
             c.id_ingrediente,
             c.fecha_compra,
             c.cantidad,
             i.nombre AS ingrediente_nombre,
             i.unidad_medida
      FROM Compras c
      JOIN Ingredientes i ON i.id_ingrediente = c.id_ingrediente
    `

    this.insert = db.prepare(
      "INSERT INTO Compras (id_ingrediente, fecha_compra, cantidad) VALUES (?, ?, ?)",
    )
    this.updateStmt = db.prepare(
      "UPDATE Compras SET id_ingrediente = ?, fecha_compra = ?, cantidad = ? WHERE id_compra = ?",
    )
    this.deleteStmt = db.prepare("DELETE FROM Compras WHERE id_compra = ?")
    this.selectById = db.prepare(`${this.baseSelect} WHERE c.id_compra = ?`)
  }

  list(filters: CompraFilters = {}): CompraRecord[] {
    const conditions: string[] = []
    const params: unknown[] = []

    if (typeof filters.ingredienteId === "number") {
      conditions.push("c.id_ingrediente = ?")
      params.push(filters.ingredienteId)
    }

    if (filters.desde) {
      conditions.push("c.fecha_compra >= ?")
      params.push(filters.desde)
    }

    if (filters.hasta) {
      conditions.push("c.fecha_compra <= ?")
      params.push(filters.hasta)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
    const statement = db.prepare(
      `${this.baseSelect} ${whereClause} ORDER BY c.fecha_compra DESC, c.id_compra DESC`,
    )
    return statement.all(...params) as CompraRecord[]
  }

  findById(id: number): CompraRecord | undefined {
    return this.selectById.get(id) as CompraRecord | undefined
  }

  create(input: CreateCompraInput): CompraRecord {
    const result = this.insert.run(input.id_ingrediente, input.fecha_compra, input.cantidad)
    const id = Number(result.lastInsertRowid)
    const created = this.findById(id)
    if (!created) {
      throw new Error("No se pudo obtener la compra creada")
    }
    return created
  }

  update(id: number, input: CreateCompraInput): CompraRecord {
    const result = this.updateStmt.run(
      input.id_ingrediente,
      input.fecha_compra,
      input.cantidad,
      id,
    )
    if (result.changes === 0) {
      throw new Error("La compra no existe")
    }
    const updated = this.findById(id)
    if (!updated) {
      throw new Error("No se pudo obtener la compra actualizada")
    }
    return updated
  }

  delete(id: number): void {
    const result = this.deleteStmt.run(id)
    if (result.changes === 0) {
      throw new Error("La compra no existe")
    }
  }
}
