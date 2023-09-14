import { Either, left, right } from "@/core/either"
import { Product } from "@/domain/workshop/enterprise/entities/product"
import { ProductsRepository } from "../../repositories/products-repository"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface GetProductByIdUseCaseRequest {
    id: string
}
type GetProductByIdUseCaseResponse = Either<ResourceNotFoundError, {product: Product}>
export class GetProductByIdUseCase { 
    constructor(
        private productRepository: ProductsRepository,
    ){}
    async execute({id}: GetProductByIdUseCaseRequest) : Promise<GetProductByIdUseCaseResponse> {
        const product = await this.productRepository.findById(id)
        if(!product){
            return left(new ResourceNotFoundError())
        }
        return right({
            product
        })
    }
    
}