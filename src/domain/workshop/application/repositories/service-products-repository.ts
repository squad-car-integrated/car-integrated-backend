import { ServiceProduct } from '../../enterprise/entities/service-products'

export abstract class ServiceProductsRepository {
  abstract findManyByServiceId(serviceId: string): Promise<ServiceProduct[]>
  abstract deleteManyByServiceId(serviceId: string): Promise<void>
}
