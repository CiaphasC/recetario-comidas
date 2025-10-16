import Fastify from "fastify"
import cors from "@fastify/cors"
import { initializeDatabase } from "./infrastructure/db/init-db"
import { registerIngredientesRoutes } from "./api/routes/ingredientes"
import { registerCategoriasRoutes } from "./api/routes/categorias"
import { registerRecetasRoutes } from "./api/routes/recetas"
import { registerRecetasPosiblesRoutes } from "./api/routes/recetas-posibles"
import { registerComprasRoutes } from "./api/routes/compras"
import { createProblemDetails } from "./utils/problem-details"

const server = Fastify({
  logger: true,
})

await server.register(cors, {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})

initializeDatabase()

await registerIngredientesRoutes(server)
await registerCategoriasRoutes(server)
await registerRecetasRoutes(server)
await registerRecetasPosiblesRoutes(server)
await registerComprasRoutes(server)

server.get("/api/health", async () => ({ status: "ok" }))

server.setErrorHandler((error, request, reply) => {
  request.log.error(error)
  if (reply.statusCode >= 500 || !reply.statusCode) {
    return reply
      .status(500)
      .send(createProblemDetails(500, "Error inesperado", error.message))
  }
  return reply
    .status(reply.statusCode)
    .send(createProblemDetails(reply.statusCode, error.message ?? "Error"))
})

const port = Number.parseInt(process.env.PORT ?? "5058", 10)
const host = process.env.HOST ?? "0.0.0.0"

server
  .listen({ port, host })
  .then(() => {
    server.log.info(`API escuchando en http://${host}:${port}`)
  })
  .catch((error) => {
    server.log.error(error)
    process.exit(1)
  })
