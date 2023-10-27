import { Either, left, right } from '@/core/either'
import { Product } from '@/domain/workshop/enterprise/entities/product'
import { ProductsRepository } from '../../repositories/products-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditProductUseCaseRequest {
  productId: string
  name: string
  unitValue: number
  productAmount: number
  description: string
  photo: string
}
type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { product: Product }
>
@Injectable()
export class EditProductUseCase {
  constructor(private productRepository: ProductsRepository) {}
  async execute({
    productId,
    name,
    unitValue,
    productAmount,
    description,
    photo,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      return left(new ResourceNotFoundError())
    }
    product.name = name
    product.unitValue = unitValue
    product.productAmount = productAmount
    product.description = description
    product.photo = photo
    await this.productRepository.save(product)
    return right({ product })
  }
}
