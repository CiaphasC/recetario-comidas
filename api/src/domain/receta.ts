import { Categoria } from "./categoria"
import { IngredienteReceta } from "./ingrediente-receta"

export interface RecetaProps {
  id_receta: number
  nombre: string
  descripcion: string | null
  categoria?: Categoria | null
  ingredientes?: IngredienteReceta[]
}

export class Receta {
  readonly id: number
  readonly nombre: string
  readonly descripcion: string | null
  readonly categoria: Categoria | null
  readonly ingredientes: IngredienteReceta[]

  constructor(props: RecetaProps) {
    this.id = props.id_receta
    this.nombre = props.nombre
    this.descripcion = props.descripcion
    this.categoria = props.categoria ?? null
    this.ingredientes = props.ingredientes ?? []
  }
}
