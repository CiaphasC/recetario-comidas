import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { IngredientesRepository } from "../../infrastructure/repositories/ingredients-repository"
import { createProblemDetails } from "../../utils/problem-details"

const ingredientBodySchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  unidad_medida: z.string().min(1, "La unidad de medida es obligatoria"),
})

const ingredientParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const ingredientQuerySchema = z.object({
  search: z.string().trim().optional(),
})

export async function registerIngredientesRoutes(app: FastifyInstance) {
  const repository = new IngredientesRepository()

  app.get("/api/ingredientes", async (request, reply) => {
    const { search } = ingredientQuerySchema.parse(request.query)
    const ingredientes = repository.list(search)

    return reply.send({
      data: ingredientes.map((ingrediente) => ({
        id: ingrediente.id_ingrediente,
        nombre: ingrediente.nombre,
        unidadMedida: ingrediente.unidad_medida,
        stockActual: ingrediente.stock_actual,
        ultimaActualizacion: ingrediente.ultima_actualizacion,
      })),
    })
  })

  app.get("/api/ingredientes/:id", async (request, reply) => {
    const { id } = ingredientParamsSchema.parse(request.params)
    const ingrediente = repository.findById(id)
    if (!ingrediente) {
      return reply
        .status(404)
        .send(createProblemDetails(404, "Ingrediente no encontrado"))
    }

    return reply.send({
      id: ingrediente.id_ingrediente,
      nombre: ingrediente.nombre,
      unidadMedida: ingrediente.unidad_medida,
      stockActual: ingrediente.stock_actual,
      ultimaActualizacion: ingrediente.ultima_actualizacion,
    })
  })

  app.post("/api/ingredientes", async (request, reply) => {
    const body = ingredientBodySchema.parse(request.body)
    try {
      const created = repository.create(body)
      return reply.status(201).send({
        id: created.id_ingrediente,
        nombre: created.nombre,
        unidadMedida: created.unidad_medida,
        stockActual: created.stock_actual,
        ultimaActualizacion: created.ultima_actualizacion,
      })
    } catch (error) {
      return reply
        .status(409)
        .send(
          createProblemDetails(
            409,
            "No se pudo crear el ingrediente",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.put("/api/ingredientes/:id", async (request, reply) => {
    const body = ingredientBodySchema.parse(request.body)
    const { id } = ingredientParamsSchema.parse(request.params)

    try {
      const updated = repository.update(id, body)
      return reply.send({
        id: updated.id_ingrediente,
        nombre: updated.nombre,
        unidadMedida: updated.unidad_medida,
        stockActual: updated.stock_actual,
        ultimaActualizacion: updated.ultima_actualizacion,
      })
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo actualizar el ingrediente",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.delete("/api/ingredientes/:id", async (request, reply) => {
    const { id } = ingredientParamsSchema.parse(request.params)
    try {
      repository.delete(id)
      return reply.status(204).send()
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo eliminar el ingrediente",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })
}
