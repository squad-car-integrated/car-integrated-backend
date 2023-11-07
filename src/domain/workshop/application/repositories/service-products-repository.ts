import { ServiceProduct } from '../../enterprise/entities/service-products'

export abstract class ServiceProductsRepository {
  abstract create(serviceProduct: ServiceProduct): Promise<void>
  abstract save(serviceProduct: ServiceProduct): Promise<void>
  abstract findManyByServiceId(serviceId: string): Promise<ServiceProduct[]>
  abstract deleteManyByServiceId(serviceId: string): Promise<void>
}
