import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ServiceProductsProps {
  serviceId: UniqueEntityID
  productId: UniqueEntityID
  quantity: number
}
export class ServiceProduct extends AggregateRoot<ServiceProductsProps> {
  get serviceId() {
    return this.props.serviceId
  }
  get productId() {
    return this.props.productId
  }
  get quantity() {
    return this.props.quantity
  }
  static create(props: ServiceProductsProps, id?: UniqueEntityID) {
    const product = new ServiceProduct(props, id)
    return product
  }
}
