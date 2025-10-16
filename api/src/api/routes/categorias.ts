import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { CategoriasRepository } from "../../infrastructure/repositories/categories-repository"
import { createProblemDetails } from "../../utils/problem-details"

const bodySchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
})

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export async function registerCategoriasRoutes(app: FastifyInstance) {
  const repository = new CategoriasRepository()

  app.get("/api/categorias", async (_request, reply) => {
    const categorias = repository.list()
    return reply.send({
      data: categorias.map((categoria) => ({
        id: categoria.id_categoria,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      })),
    })
  })

  app.post("/api/categorias", async (request, reply) => {
    const body = bodySchema.parse(request.body)
    try {
      const created = repository.create(body)
      return reply.status(201).send({
        id: created.id_categoria,
        nombre: created.nombre,
        descripcion: created.descripcion,
      })
    } catch (error) {
      return reply
        .status(409)
        .send(
          createProblemDetails(
            409,
            "No se pudo crear la categoría",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.put("/api/categorias/:id", async (request, reply) => {
    const body = bodySchema.parse(request.body)
    const { id } = paramsSchema.parse(request.params)
    try {
      const updated = repository.update(id, body)
      return reply.send({
        id: updated.id_categoria,
        nombre: updated.nombre,
        descripcion: updated.descripcion,
      })
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo actualizar la categoría",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.delete("/api/categorias/:id", async (request, reply) => {
    const { id } = paramsSchema.parse(request.params)
    try {
      repository.delete(id)
      return reply.status(204).send()
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo eliminar la categoría",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })
}
