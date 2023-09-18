import { ServiceProducts } from '../../enterprise/entities/service-products'

export interface ServiceProductsRepository {
  findManyByServiceId(serviceId: string): Promise<ServiceProducts[]>
  deleteManyByServiceId(serviceId: string): Promise<void>
}
