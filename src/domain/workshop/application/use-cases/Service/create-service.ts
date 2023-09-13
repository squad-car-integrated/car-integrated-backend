import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { ServicesRepository } from "../../repositories/services-repository"
import { Service } from "../../../enterprise/entities/services"
import { ServiceProductList } from "@/domain/workshop/enterprise/entities/service-product-list"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
interface CreateServiceUseCaseRequest {
    automobileId: string
    ownerId: string
    employeesIds: string[]
    products: ServiceProductList
    totalValue: number
    description: string
    status: ServiceStatus
}
type CreateServiceUseCaseResponse = Either<null, {
    service: Service
}>
// @Injectable()
// export class CreateServiceUseCase { 
//     constructor(
//         private serviceRepository: ServicesRepository,
//     ){}
//     async execute({automobileId, ownerId, employeesIds,products,totalValue, description, status}: CreateServiceUseCaseRequest) : Promise<CreateServiceUseCaseResponse> {
//         const service = Service.create({
//             automobileId : new UniqueEntityID(automobileId),
//             ownerId : new UniqueEntityID(ownerId),
//             employeesIds : [new UniqueEntityID(employeesIds["1"])],
//             products,
//             totalValue, 
//             description, 
//             status
//         })
//         await this.serviceRepository.create(service)
//         return right({
//             service
//         })
//     }
    
// }