const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5058/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new ApiError(response.status, text || response.statusText)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function toIngrediente(payload: any) {
  return {
    id: payload.id ?? payload.id_ingrediente,
    nombre: payload.nombre,
    unidadMedida: payload.unidadMedida ?? payload.unidad_medida,
    cantidadDisponible: Number(payload.stockActual ?? payload.cantidadDisponible ?? 0),
    actualizadoEn: payload.ultimaActualizacion ?? payload.ultima_actualizacion ?? undefined,
  }
}

function toCategoria(payload: any) {
  return {
    id: payload.id ?? payload.id_categoria,
    nombre: payload.nombre,
    descripcion: payload.descripcion ?? undefined,
  }
}

function toReceta(payload: any) {
  return {
    id: payload.id ?? payload.id_receta,
    nombre: payload.nombre,
    descripcion: payload.descripcion ?? undefined,
    instrucciones: payload.instrucciones ?? undefined,
    categoriaId: payload.categoriaId ?? payload.id_categoria ?? undefined,
    categoriaNombre: payload.categoriaNombre ?? payload.categoria_nombre ?? undefined,
    ingredientes: (payload.ingredientes ?? []).map((ingredient: any) => ({
      ingredienteId: ingredient.idIngrediente ?? ingredient.id_ingrediente,
      ingredienteNombre: ingredient.nombre ?? ingredient.ingredienteNombre,
      unidadMedida: ingredient.unidadMedida ?? ingredient.unidad_medida,
      cantidadNecesaria: ingredient.cantidad ?? ingredient.cantidadNecesaria,
    })),
    porcentajeCompletitud: payload.porcentajeCompletitud ?? payload.porcentaje_completitud ?? undefined,
    completa:
      payload.completa ??
      (payload.completitud !== undefined ? payload.completitud === "completa" : undefined),
  }
}

function toRecetaPosible(payload: any) {
  const base = toReceta(payload)
  return {
    ...base,
    ingredientesDisponibles:
      payload.ingredientesDisponibles ?? payload.ingredientes_disponibles ?? 0,
    ingredientesFaltantes:
      payload.ingredientesFaltantes ?? payload.ingredientes_faltantes ?? 0,
  }
}

function toCompra(payload: any) {
  return {
    id: payload.id ?? payload.id_compra,
    ingredienteId: payload.ingredienteId ?? payload.id_ingrediente,
    ingredienteNombre: payload.ingredienteNombre ?? payload.nombreIngrediente,
    cantidad: payload.cantidad,
    unidadMedida: payload.unidadMedida ?? payload.unidad_medida,
    fechaCompra: payload.fechaCompra ?? payload.fecha_compra,
  }
}

export const ingredientesApi = {
  getAll: async () => {
    const { data } = await request<{ data: any[] }>("/ingredientes")
    return data.map(toIngrediente)
  },
  getById: async (id: number) => {
    const payload = await request<any>(`/ingredientes/${id}`)
    return payload ? toIngrediente(payload) : null
  },
  create: async (input: { nombre: string; unidadMedida: string }) => {
    const payload = await request<any>("/ingredientes", {
      method: "POST",
      body: JSON.stringify({
        nombre: input.nombre,
        unidad_medida: input.unidadMedida,
      }),
    })
    return toIngrediente(payload)
  },
  update: async (id: number, input: { nombre: string; unidadMedida: string }) => {
    const payload = await request<any>(`/ingredientes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: input.nombre,
        unidad_medida: input.unidadMedida,
      }),
    })
    return toIngrediente(payload)
  },
  delete: async (id: number) => {
    await request<void>(`/ingredientes/${id}`, { method: "DELETE" })
  },
}

export const categoriasApi = {
  getAll: async () => {
    const { data } = await request<{ data: any[] }>("/categorias")
    return data.map(toCategoria)
  },
  create: async (input: { nombre: string; descripcion?: string }) => {
    const payload = await request<any>("/categorias", {
      method: "POST",
      body: JSON.stringify({
        nombre: input.nombre,
        descripcion: input.descripcion,
      }),
    })
    return toCategoria(payload)
  },
  update: async (id: number, input: { nombre: string; descripcion?: string }) => {
    const payload = await request<any>(`/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: input.nombre,
        descripcion: input.descripcion,
      }),
    })
    return toCategoria(payload)
  },
  delete: async (id: number) => {
    await request<void>(`/categorias/${id}`, { method: "DELETE" })
  },
}

export const recetasApi = {
  getAll: async (params?: { search?: string; categoria?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.categoria) searchParams.set("categoria", params.categoria)
    const suffix = searchParams.toString() ? `?${searchParams.toString()}` : ""
    const { data } = await request<{ data: any[] }>(`/recetas${suffix}`)
    return data.map(toReceta)
  },
  getById: async (id: number) => {
    const payload = await request<any>(`/recetas/${id}`)
    return payload ? toReceta(payload) : null
  },
  create: async (input: {
    nombre: string
    descripcion?: string
    categoriaId?: number | null
    ingredientes: Array<{ ingredienteId: number; cantidadNecesaria: number }>
  }) => {
    const payload = await request<any>("/recetas", {
      method: "POST",
      body: JSON.stringify({
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        id_categoria: input.categoriaId ?? null,
        ingredientes: input.ingredientes.map((ingredient) => ({
          id_ingrediente: ingredient.ingredienteId,
          cantidad: ingredient.cantidadNecesaria,
        })),
      }),
    })
    return toReceta(payload)
  },
  update: async (
    id: number,
    input: {
      nombre: string
      descripcion?: string
      categoriaId?: number | null
      ingredientes: Array<{ ingredienteId: number; cantidadNecesaria: number }>
    },
  ) => {
    const payload = await request<any>(`/recetas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: input.nombre,
        descripcion: input.descripcion ?? null,
        id_categoria: input.categoriaId ?? null,
        ingredientes: input.ingredientes.map((ingredient) => ({
          id_ingrediente: ingredient.ingredienteId,
          cantidad: ingredient.cantidadNecesaria,
        })),
      }),
    })
    return toReceta(payload)
  },
  delete: async (id: number) => {
    await request<void>(`/recetas/${id}`, { method: "DELETE" })
  },
  getPosibles: async (ingredientes?: string, categoria?: string) => {
    const params = new URLSearchParams()
    if (ingredientes) params.set("ingredientes", ingredientes)
    if (categoria) params.set("categoria", categoria)
    const suffix = params.toString() ? `?${params.toString()}` : ""
    const payload = await request<{ recetas: any[] }>(`/recetas/posibles${suffix}`)
    return payload.recetas.map(toRecetaPosible)
  },
}

export const comprasApi = {
  getAll: async (filters?: { ingredienteId?: number; desde?: string; hasta?: string }) => {
    const params = new URLSearchParams()
    if (filters?.ingredienteId) params.set("ingredienteId", String(filters.ingredienteId))
    if (filters?.desde) params.set("desde", filters.desde)
    if (filters?.hasta) params.set("hasta", filters.hasta)
    const suffix = params.toString() ? `?${params.toString()}` : ""
    const { data } = await request<{ data: any[] }>(`/compras${suffix}`)
    return data.map(toCompra)
  },
  create: async (input: { ingredienteId: number; fechaCompra: string; cantidad: number }) => {
    const payload = await request<any>("/compras", {
      method: "POST",
      body: JSON.stringify({
        id_ingrediente: input.ingredienteId,
        fecha_compra: input.fechaCompra,
        cantidad: input.cantidad,
      }),
    })
    return toCompra(payload)
  },
  update: async (id: number, input: { ingredienteId: number; fechaCompra: string; cantidad: number }) => {
    const payload = await request<any>(`/compras/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id_ingrediente: input.ingredienteId,
        fecha_compra: input.fechaCompra,
        cantidad: input.cantidad,
      }),
    })
    return toCompra(payload)
  },
  delete: async (id: number) => {
    await request<void>(`/compras/${id}`, { method: "DELETE" })
  },
}
