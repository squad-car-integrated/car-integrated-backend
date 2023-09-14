import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { ServicesRepository } from "../../repositories/services-repository"
import { Service } from "@/domain/workshop/enterprise/entities/service"

interface FetchRecentServicesUseCaseRequest {
    page: number
}
type FetchRecentServicesUseCaseResponse = Either<null,{services: Service[]}>
@Injectable()
export class FetchRecentServicesUseCase { 
    constructor(
        private serviceRepository: ServicesRepository,
    ){}
    async execute({page}: FetchRecentServicesUseCaseRequest) : Promise<FetchRecentServicesUseCaseResponse> {
        const services = await this.serviceRepository.findManyRecent({page})
        return right({
            services
        })
    }
    
}