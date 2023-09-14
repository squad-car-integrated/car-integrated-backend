import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Product } from "@/domain/workshop/enterprise/entities/product"
import { ProductsRepository } from "../../repositories/products-repository"
import { NotAllowedError } from "../errors/not-allowed-error"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface EditProductUseCaseRequest {
    productId: string
    name: string
    unitValue: number
    productAmout: number
    description: string
    photo: string
}
type EditProductUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError ,{product: Product}>
export class EditProductUseCase { 
    constructor(
        private productRepository: ProductsRepository,
    ){}
    async execute({productId,name,unitValue,productAmout,description,photo}: EditProductUseCaseRequest) : Promise<EditProductUseCaseResponse> {
        const product = await this.productRepository.findById(productId);
        if(!product){
            return left(new ResourceNotFoundError)
        }
        product.name = name
        product.unitValue = unitValue
        product.productAmout = productAmout
        product.description = description
        product.photo = photo
        await this.productRepository.save(product)
        return right({product})
    }
    
}