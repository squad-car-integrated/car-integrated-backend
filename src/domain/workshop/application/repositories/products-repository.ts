import { PaginationParams } from '@/core/repositories/pagination-params'
import { Product } from '../../enterprise/entities/product'

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findManyRecent(params: PaginationParams): Promise<Product[]>
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
}
