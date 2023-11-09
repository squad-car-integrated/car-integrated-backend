import { Either, right } from '@/core/either'
import { Product } from '@/domain/workshop/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../../repositories/products-repository'

interface FetchRecentProductsUseCaseRequest {
    page: number
}
type FetchRecentProductsUseCaseResponse = Either<null, { products: Product[] }>
@Injectable()
export class FetchRecentProductsUseCase {
    constructor(private productRepository: ProductsRepository) {}
    async execute({
        page,
    }: FetchRecentProductsUseCaseRequest): Promise<FetchRecentProductsUseCaseResponse> {
        const products = await this.productRepository.findManyRecent({ page })
        return right({
            products,
        })
    }
}
