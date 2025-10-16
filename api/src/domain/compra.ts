export interface CompraProps {
  id_compra: number
  id_ingrediente: number
  fecha_compra: string
  cantidad: number
}

export class Compra {
  readonly id: number
  readonly ingredienteId: number
  readonly fechaCompra: string
  readonly cantidad: number

  constructor(props: CompraProps) {
    this.id = props.id_compra
    this.ingredienteId = props.id_ingrediente
    this.fechaCompra = props.fecha_compra
    this.cantidad = props.cantidad
  }
}
