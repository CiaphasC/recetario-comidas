import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { ComprasRepository } from "../../infrastructure/repositories/compras-repository"
import { createProblemDetails } from "../../utils/problem-details"

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD")

const bodySchema = z.object({
  id_ingrediente: z.coerce.number().int().positive(),
  fecha_compra: isoDateSchema.default(() => new Date().toISOString().slice(0, 10)),
  cantidad: z.coerce.number().positive("La cantidad debe ser mayor que 0"),
})

const querySchema = z.object({
  ingredienteId: z.coerce.number().int().positive().optional(),
  desde: isoDateSchema.optional(),
  hasta: isoDateSchema.optional(),
})

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export async function registerComprasRoutes(app: FastifyInstance) {
  const repository = new ComprasRepository()

  app.get("/api/compras", async (request, reply) => {
    const filters = querySchema.parse(request.query)
    const compras = repository.list({
      ingredienteId: filters.ingredienteId,
      desde: filters.desde,
      hasta: filters.hasta,
    })

    return reply.send({
      data: compras.map((compra) => ({
        id: compra.id_compra,
        ingredienteId: compra.id_ingrediente,
        fechaCompra: compra.fecha_compra,
        cantidad: compra.cantidad,
        ingredienteNombre: compra.ingrediente_nombre,
        unidadMedida: compra.unidad_medida,
      })),
    })
  })

  app.post("/api/compras", async (request, reply) => {
    const body = bodySchema.parse(request.body ?? {})
    try {
      const created = repository.create(body)
      return reply.status(201).send({
        id: created.id_compra,
        ingredienteId: created.id_ingrediente,
        fechaCompra: created.fecha_compra,
        cantidad: created.cantidad,
        ingredienteNombre: created.ingrediente_nombre,
        unidadMedida: created.unidad_medida,
      })
    } catch (error) {
      return reply
        .status(400)
        .send(
          createProblemDetails(
            400,
            "No se pudo registrar la compra",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.put("/api/compras/:id", async (request, reply) => {
    const body = bodySchema.parse(request.body ?? {})
    const { id } = paramsSchema.parse(request.params)
    try {
      const updated = repository.update(id, body)
      return reply.send({
        id: updated.id_compra,
        ingredienteId: updated.id_ingrediente,
        fechaCompra: updated.fecha_compra,
        cantidad: updated.cantidad,
        ingredienteNombre: updated.ingrediente_nombre,
        unidadMedida: updated.unidad_medida,
      })
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo actualizar la compra",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.delete("/api/compras/:id", async (request, reply) => {
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
            "No se pudo eliminar la compra",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })
}
