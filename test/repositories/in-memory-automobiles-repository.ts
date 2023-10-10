import { PaginationParams } from '@/core/repositories/pagination-params'
import { AutomobilesRepository } from '@/domain/workshop/application/repositories/automobiles-repository'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'

export class InMemoryAutomobilesRepository implements AutomobilesRepository {
  async findByPlate(plate: string): Promise<Automobile | null> {
    const automobile = this.items.find(
      (item) => item.plate.toString() === plate,
    )
    if (!automobile) {
      return null
    }
    return automobile
  }
  async findManyRecent({ page }: PaginationParams) {
    const sortedProducts = this.items
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const products = sortedProducts.slice((page - 1) * 20, page * 20)
    return products
  }
  public items: Automobile[] = []
  async findById(id: string) {
    const automobile = this.items.find((item) => item.id.toString() === id)
    if (!automobile) {
      return null
    }
    return automobile
  }
  async create(automobile: Automobile) {
    this.items.push(automobile)
  }
  async save(automobile: Automobile) {
    const itemIndex = this.items.findIndex((item) => item.id === automobile.id)
    this.items[itemIndex] = automobile
  }
  async delete(automobile: Automobile) {
    const itemIndex = this.items.findIndex((item) => item.id === automobile.id)
    this.items.splice(itemIndex, 1)
  }
}
