import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../../repositories/products-repository'
import { Product } from '../../../enterprise/entities/product'
interface CreateProductUseCaseRequest {
  name: string
  unitValue: number
  productAmout: number
  description: string
  photo: string
}
type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product
  }
>
@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductsRepository) {}
  async execute({
    name,
    unitValue,
    productAmout,
    description,
    photo,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      unitValue,
      productAmout,
      description,
      photo,
    })
    await this.productRepository.create(product)
    return right({
      product,
    })
  }
}
