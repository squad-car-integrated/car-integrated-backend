import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Service } from "@/domain/workshop/enterprise/entities/service"
import { ServiceProductsRepository } from "../../repositories/service-products-repository"
import { ServicesRepository } from "../../repositories/services-repository"
import { NotAllowedError } from "../errors/not-allowed-error"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"
import { ServiceProductList } from "@/domain/workshop/enterprise/entities/service-product-list"
import { ServiceProducts } from "@/domain/workshop/enterprise/entities/service-products"
import { ServiceStatus } from "@/core/entities/service-status-enum"

interface EditServiceUseCaseRequest {
    serviceId: string
    totalValue: number
    description: string
    status: ServiceStatus
    productsIds: string[]
}
type EditServiceUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError ,{service: Service}>
export class EditServiceUseCase { 
    constructor(
        private serviceRepository: ServicesRepository,
        private serviceProductsRepository: ServiceProductsRepository
    ){}
    async execute({serviceId,totalValue,description,status,productsIds}: EditServiceUseCaseRequest) : Promise<EditServiceUseCaseResponse> {
        const service = await this.serviceRepository.findById(serviceId);
        if(!service){
            return left(new ResourceNotFoundError)
        }
        const currentServiceProducts = await this.serviceProductsRepository.findManyByServiceId(serviceId)
        const serviceAttachmentList = new ServiceProductList(currentServiceProducts)

        const serviceProducts = productsIds.map(attachmentId => {
            return ServiceProducts.create({
                productId: new UniqueEntityID(attachmentId),
                serviceId: service.id, 
            })
        })
        serviceAttachmentList.update(serviceProducts)
        service.totalValue = totalValue
        service.description = description
        service.status = status
        service.products = serviceAttachmentList
        await this.serviceRepository.save(service)
        return right({service})
    }
    
}