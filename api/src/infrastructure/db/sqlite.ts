import { DatabaseSync } from "node:sqlite"
import { readFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, isAbsolute, join, resolve } from "node:path"

const DEFAULT_DB_RELATIVE_PATH = join("db", "recetario.db")

function resolveDatabasePath(): string {
  const envPath = process.env.SQLITE_DB_PATH
  if (envPath && envPath.trim().length > 0) {
    return isAbsolute(envPath) ? envPath : resolve(envPath)
  }
  return resolve(DEFAULT_DB_RELATIVE_PATH)
}

export const databasePath = resolveDatabasePath()

const dbDirectory = dirname(databasePath)
if (!existsSync(dbDirectory)) {
  mkdirSync(dbDirectory, { recursive: true })
}

export const db = new DatabaseSync(databasePath, {
  enableForeignKeyConstraints: true,
})

db.exec("PRAGMA foreign_keys = ON;")
db.exec("PRAGMA journal_mode = WAL;")
db.exec("PRAGMA synchronous = NORMAL;")

db.function(
  "normalize_text",
  { deterministic: true },
  (value: unknown): string => {
    if (typeof value !== "string") {
      return ""
    }
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
  },
)

export function runScriptFile(filePath: string): void {
  const absolutePath = isAbsolute(filePath) ? filePath : resolve(filePath)
  const script = readFileSync(absolutePath, "utf-8")
  db.exec(script)
}
