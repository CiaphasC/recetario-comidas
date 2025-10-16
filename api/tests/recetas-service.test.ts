import { test, before, after } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

let tempDir: string

before(async () => {
  tempDir = mkdtempSync(join(tmpdir(), "recetario-test-"))
  const dbPath = join(tempDir, "recetario.db")
  process.env.SQLITE_DB_PATH = dbPath

  const { initializeDatabase } = await import("../src/infrastructure/db/init-db.ts")
  initializeDatabase()
})

test("RecetasService#getPossible calcula completitud correcta", async () => {
  const { RecetasService } = await import("../src/services/recetas-service.ts")
  const service = new RecetasService()

  const posibles = service.getPossible({
    ingredientTokens: [
      "filete de pescado fresco",
      "limon",
      "cebolla roja",
      "aji limo",
      "culantro",
      "camote",
      "choclo desgranado",
      "sal",
    ],
  })

  const ceviche = posibles.find((item) => item.nombre.toLowerCase().includes("ceviche"))
  assert.ok(ceviche, "Debe existir la receta de ceviche")
  assert.equal(ceviche.completitud, "completa")
  assert.equal(ceviche.ingredientesFaltantes, 0)
  assert.equal(ceviche.ingredientesDisponibles, ceviche.ingredientes.length)
})

test("RecetasService#getPossible marca faltantes cuando faltan ingredientes", async () => {
  const { RecetasService } = await import("../src/services/recetas-service.ts")
  const service = new RecetasService()

  const posibles = service.getPossible({
    ingredientTokens: ["papa amarilla", "atun en lata"],
  })

  const causa = posibles.find((item) => item.nombre.toLowerCase().includes("causa"))
  assert.ok(causa, "Debe existir la receta de causa")
  assert.equal(causa.completitud, "incompleta")
  assert.ok(causa.faltantes.length > 0)
})

after(async () => {
  const { db } = await import("../src/infrastructure/db/sqlite.ts")
  try {
    db.close()
  } catch (error) {
    // ignore close errors
  }
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true })
  }
})
