import { Either, left, right } from '@/core/either'
import { ProductsRepository } from '../../repositories/products-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteProductUseCaseRequest {
  productId: string
}
type DeleteProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>
export class DeleteProductUseCase {
  constructor(private productRepository: ProductsRepository) {}
  async execute({
    productId,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      return left(new ResourceNotFoundError())
    }
    await this.productRepository.delete(product)
    return right({})
  }
}
