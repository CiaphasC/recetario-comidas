import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { db } from "./sqlite"

function tableExists(tableName: string): boolean {
  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
  const row = stmt.get(tableName)
  return Boolean(row)
}

function tableHasRows(tableName: string): boolean {
  if (!tableExists(tableName)) {
    return false
  }
  const escapedName = tableName.replace(/"/g, '""')
  const stmt = db.prepare(`SELECT COUNT(1) AS total FROM "${escapedName}"`)
  const row = stmt.get() as { total?: number } | undefined
  return Boolean(row && typeof row.total === "number" && row.total > 0)
}

export function initializeDatabase(): void {
  const schemaPath = join(process.cwd(), "db", "schema.sql")
  const seedPath = join(process.cwd(), "db", "seed.sql")

  const schemaSql = readFileSync(schemaPath, "utf-8")
  db.exec(schemaSql)

  const shouldSeed = !tableHasRows("Recetas")

  if (shouldSeed && existsSync(seedPath)) {
    const seedSql = readFileSync(seedPath, "utf-8")
    db.exec(seedSql)
  }
}
