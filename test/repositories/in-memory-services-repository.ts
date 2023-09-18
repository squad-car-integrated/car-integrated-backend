import { PaginationParams } from '@/core/repositories/pagination-params'
import { ServiceProductsRepository } from '@/domain/workshop/application/repositories/service-products-repository'
import { ServicesRepository } from '@/domain/workshop/application/repositories/services-repository'
import { Service } from '@/domain/workshop/enterprise/entities/service'

export class InMemoryServicesRepository implements ServicesRepository {
  constructor(private serviceProductsRepository: ServiceProductsRepository) {}
  async findManyRecent({ page }: PaginationParams) {
    return this.toSorted(page)
  }
  public items: Service[] = []
  async findById(id: string) {
    const service = this.items.find((item) => item.id.toString() === id)
    if (!service) {
      return null
    }
    return service
  }
  async create(service: Service) {
    this.items.push(service)
  }
  async save(service: Service) {
    const itemIndex = this.items.findIndex((item) => item.id === service.id)
    this.items[itemIndex] = service
  }
  async delete(service: Service) {
    const itemIndex = this.items.findIndex((item) => item.id === service.id)
    this.items.splice(itemIndex, 1)
    this.serviceProductsRepository.deleteManyByServiceId(service.id.toString())
  }
  async toSorted(page: number){
    return this.items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice((page - 1) * 20, page * 20)
  }
}
