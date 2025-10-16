export interface IngredienteProps {
  id_ingrediente: number
  nombre: string
  unidad_medida: string
}

export class Ingrediente {
  readonly id: number
  readonly nombre: string
  readonly unidadMedida: string

  constructor(props: IngredienteProps) {
    this.id = props.id_ingrediente
    this.nombre = props.nombre
    this.unidadMedida = props.unidad_medida
  }
}
