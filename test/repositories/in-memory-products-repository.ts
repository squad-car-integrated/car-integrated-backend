import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProductsRepository } from '@/domain/workshop/application/repositories/products-repository'
import { Product } from '@/domain/workshop/enterprise/entities/product'

export class InMemoryProductsRepository implements ProductsRepository {
  async findManyRecent({ page }: PaginationParams) {
    const sortedProducts = this.items.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const products = sortedProducts.slice((page - 1) * 20, page * 20);
    return products;
  }
  public items: Product[] = []
  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id)
    if (!product) {
      return null
    }
    return product
  }
  async create(product: Product) {
    this.items.push(product)
  }
  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)
    this.items[itemIndex] = product
  }
  async delete(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)
    this.items.splice(itemIndex, 1)
  }
}
