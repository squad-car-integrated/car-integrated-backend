import { ServiceProductsRepository } from '@/domain/workshop/application/repositories/service-products-repository'
import { ServiceProducts } from '@/domain/workshop/enterprise/entities/service-products'

export class InMemoryServiceProductsRepository
  implements ServiceProductsRepository
{
  async deleteManyByServiceId(serviceId: string) {
    const serviceProducts = this.items.filter(
      (item) => item.serviceId.toString() !== serviceId,
    )
    this.items = serviceProducts
  }
  public items: ServiceProducts[] = []
  async findManyByServiceId(serviceId: string) {
    const serviceProducts = this.items.filter(
      (item) => item.serviceId.toString() === serviceId,
    )
    return serviceProducts
  }
}
