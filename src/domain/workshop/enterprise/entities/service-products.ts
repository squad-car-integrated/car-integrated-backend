import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ServiceProductsProps {
  serviceId: UniqueEntityID
  productId: UniqueEntityID
}
export class ServiceProducts extends Entity<ServiceProductsProps> {
  get serviceId() {
    return this.props.serviceId
  }
  get productId() {
    return this.props.productId
  }
  static create(props: ServiceProductsProps, id?: UniqueEntityID) {
    const product = new ServiceProducts(props, id)
    return product
  }
}
