import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { ServicesRepository } from "../../repositories/services-repository"
import { Service } from "../../../enterprise/entities/services"
import { ServiceProductList } from "@/domain/workshop/enterprise/entities/service-product-list"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ServiceStatus } from "@/core/entities/service-status-enum"
import { ServiceProduct } from "@/domain/workshop/enterprise/entities/service-products"
interface CreateServiceUseCaseRequest {
    automobileId: string
    ownerId: string
    employeesIds: string[]
    productsIds: string[]
    totalValue: number
    description: string
    status: ServiceStatus
}
type CreateServiceUseCaseResponse = Either<null, {
    service: Service
}>
@Injectable()
export class CreateServiceUseCase { 
    constructor(
        private serviceRepository: ServicesRepository,
    ){}
    async execute({automobileId, ownerId, employeesIds,productsIds,totalValue, description, status}: CreateServiceUseCaseRequest) : Promise<CreateServiceUseCaseResponse> {
        const employeesIdsFormat: UniqueEntityID[] = []
        employeesIds.forEach(id => {
            const uniqueId = new UniqueEntityID(id)
            employeesIdsFormat.push(uniqueId)
        })
        const service = Service.create({
            automobileId : new UniqueEntityID(automobileId),
            ownerId : new UniqueEntityID(ownerId),
            employeesIds : employeesIdsFormat,
            totalValue, 
            description, 
            status
        })
        const serviceProducts = productsIds.map(productId => {
            return ServiceProduct.create({
                productId: new UniqueEntityID(productId),
                serviceId: service.id
            })
        })
        service.products = new ServiceProductList(serviceProducts)
        await this.serviceRepository.create(service)
        return right({
            service
        })
    }
    
}