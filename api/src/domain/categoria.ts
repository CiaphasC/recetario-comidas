export interface CategoriaProps {
  id_categoria: number
  nombre: string
}

export class Categoria {
  readonly id: number
  readonly nombre: string

  constructor(props: CategoriaProps) {
    this.id = props.id_categoria
    this.nombre = props.nombre
  }
}
