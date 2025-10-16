export interface IngredienteRecetaProps {
  id_receta: number
  id_ingrediente: number
  cantidad: number
  nombre?: string
  unidad_medida?: string
}

export class IngredienteReceta {
  readonly recetaId: number
  readonly ingredienteId: number
  readonly cantidad: number
  readonly nombre?: string
  readonly unidadMedida?: string

  constructor(props: IngredienteRecetaProps) {
    this.recetaId = props.id_receta
    this.ingredienteId = props.id_ingrediente
    this.cantidad = props.cantidad
    this.nombre = props.nombre
    this.unidadMedida = props.unidad_medida
  }
}
