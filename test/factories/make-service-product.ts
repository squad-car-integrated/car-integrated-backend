import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ServiceProduct,
  ServiceProductsProps,
} from '@/domain/workshop/enterprise/entities/service-products'

export function makeServiceProduct(
  override: Partial<ServiceProductsProps> = {},
  id?: UniqueEntityID,
) {
  const serviceproduct = ServiceProduct.create(
    {
      serviceId: new UniqueEntityID(),
      productId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return serviceproduct
}
