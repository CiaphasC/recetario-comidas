#!/usr/bin/env node

const { spawnSync } = require("node:child_process")
const path = require("node:path")

const apiPath = path.resolve(__dirname, "..", "..", "api")

try {
  const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["install"], {
    cwd: apiPath,
    stdio: "inherit",
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
} catch (error) {
  console.warn("[postinstall] No se pudo instalar dependencias del backend automaticamente:", error.message)
  console.warn("[postinstall] Ejecuta manualmente: cd api && npm install")
}
