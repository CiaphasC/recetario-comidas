import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { RecetasService } from "../../services/recetas-service"

const querySchema = z.object({
  ingredientes: z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean))
    .optional(),
  categoria: z.string().optional(),
})

export async function registerRecetasPosiblesRoutes(app: FastifyInstance) {
  const service = new RecetasService()

  app.get("/api/recetas/posibles", async (request, reply) => {
    const query = querySchema.parse(request.query ?? {})
    const recetas = service.getPossible({
      ingredientTokens: query.ingredientes,
      categoria: query.categoria,
    })

    return reply.send({
      recetas: recetas.map((receta) => ({
        id: receta.id_receta,
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        categoriaId: receta.id_categoria,
        categoriaNombre: receta.categoria_nombre,
        completitud: receta.completitud,
        faltantes: receta.faltantes,
        ingredientesDisponibles: receta.ingredientesDisponibles,
        ingredientesFaltantes: receta.ingredientesFaltantes,
        porcentajeCompletitud: receta.porcentajeCompletitud,
        ingredientes: receta.ingredientes.map((ing) => ({
          idIngrediente: ing.id_ingrediente,
          nombre: ing.nombre,
          unidadMedida: ing.unidad_medida,
          cantidad: ing.cantidad,
        })),
      })),
    })
  })
}
