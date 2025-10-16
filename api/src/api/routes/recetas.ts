import type { FastifyInstance } from "fastify"
import { z } from "zod"
import { RecetasService } from "../../services/recetas-service"
import { createProblemDetails } from "../../utils/problem-details"

const ingredientSchema = z.object({
  id_ingrediente: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().positive("La cantidad debe ser mayor que 0"),
})

const recipeBodySchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().nullable().optional(),
  id_categoria: z.coerce.number().int().positive().optional().nullable(),
  ingredientes: z.array(ingredientSchema).min(1, "Debe indicar al menos un ingrediente"),
})

const recipesQuerySchema = z.object({
  search: z.string().optional(),
  categoria: z.union([z.coerce.number().int().positive(), z.string()]).optional(),
})

const recipeParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

function mapRecipeResponse(recipe: ReturnType<RecetasService["getById"]>) {
  if (!recipe) return undefined
  return {
    id: recipe.id_receta,
    nombre: recipe.nombre,
    descripcion: recipe.descripcion,
    categoriaId: recipe.id_categoria,
    categoriaNombre: recipe.categoria_nombre,
    ingredientes: recipe.ingredientes.map((ing) => ({
      idIngrediente: ing.id_ingrediente,
      nombre: ing.nombre,
      unidadMedida: ing.unidad_medida,
      cantidad: ing.cantidad,
    })),
  }
}

export async function registerRecetasRoutes(app: FastifyInstance) {
  const service = new RecetasService()

  app.get("/api/recetas", async (request, reply) => {
    const { search, categoria } = recipesQuerySchema.parse(request.query)
    let categoriaId: number | undefined
    if (typeof categoria === "number") {
      categoriaId = categoria
    } else if (typeof categoria === "string" && categoria.trim() !== "") {
      const maybeNumber = Number.parseInt(categoria, 10)
      categoriaId = Number.isNaN(maybeNumber) ? undefined : maybeNumber
    }

    const recetas = service.list({
      search,
      categoriaId,
    })

    return reply.send({
      data: recetas.map((receta) => ({
        id: receta.id_receta,
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        categoriaId: receta.id_categoria,
        categoriaNombre: receta.categoria_nombre,
        ingredientes: receta.ingredientes.map((ing) => ({
          idIngrediente: ing.id_ingrediente,
          nombre: ing.nombre,
          unidadMedida: ing.unidad_medida,
          cantidad: ing.cantidad,
        })),
      })),
    })
  })

  app.get("/api/recetas/:id", async (request, reply) => {
    const { id } = recipeParamsSchema.parse(request.params)
    const receta = service.getById(id)
    if (!receta) {
      return reply
        .status(404)
        .send(createProblemDetails(404, "Receta no encontrada"))
    }
    return reply.send(mapRecipeResponse(receta))
  })

  app.post("/api/recetas", async (request, reply) => {
    const body = recipeBodySchema.parse(request.body)
    try {
      const created = service.create(body)
      return reply.status(201).send(mapRecipeResponse(created))
    } catch (error) {
      return reply
        .status(400)
        .send(
          createProblemDetails(
            400,
            "No se pudo crear la receta",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.put("/api/recetas/:id", async (request, reply) => {
    const body = recipeBodySchema.parse(request.body)
    const { id } = recipeParamsSchema.parse(request.params)
    try {
      const updated = service.update(id, body)
      return reply.send(mapRecipeResponse(updated))
    } catch (error) {
      return reply
        .status(400)
        .send(
          createProblemDetails(
            400,
            "No se pudo actualizar la receta",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })

  app.delete("/api/recetas/:id", async (request, reply) => {
    const { id } = recipeParamsSchema.parse(request.params)
    try {
      service.delete(id)
      return reply.status(204).send()
    } catch (error) {
      return reply
        .status(404)
        .send(
          createProblemDetails(
            404,
            "No se pudo eliminar la receta",
            error instanceof Error ? error.message : undefined,
          ),
        )
    }
  })
}
