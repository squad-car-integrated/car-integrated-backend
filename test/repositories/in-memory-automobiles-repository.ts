import { PaginationParams } from '@/core/repositories/pagination-params'
import { AutomobilesRepository } from '@/domain/workshop/application/repositories/automobiles-repository'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'

export class InMemoryAutomobilesRepository implements AutomobilesRepository {
  async findManyRecent({ page }: PaginationParams) {
    const automobiles = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
    return automobiles
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
