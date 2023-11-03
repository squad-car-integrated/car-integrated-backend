import { ServiceProductsRepository } from '@/domain/workshop/application/repositories/service-products-repository'
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'

export class InMemoryServiceProductsRepository
  implements ServiceProductsRepository
{
  async deleteManyByServiceId(serviceId: string) {
    const serviceProducts = this.items.filter(
      (item) => item.serviceId.toString() !== serviceId,
    )
    this.items = serviceProducts
  }
  public items: ServiceProduct[] = []
  async findManyByServiceId(serviceId: string) {
    const serviceProducts = this.items.filter(
      (item) => item.serviceId.toString() === serviceId,
    )
    return serviceProducts
  }
}
