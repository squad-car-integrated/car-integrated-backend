
import { Either, left, right } from "@/core/either";
import { ServicesRepository } from "../../repositories/services-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteServiceUseCaseRequest {
    serviceId: string
}
type DeleteServiceUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError ,{}>
export class DeleteServiceUseCase { 
    constructor(
        private serviceRepository: ServicesRepository,
    ){}
    async execute({serviceId}: DeleteServiceUseCaseRequest) : Promise<DeleteServiceUseCaseResponse> {
        const service = await this.serviceRepository.findById(serviceId);
        if(!service){
            return left(new ResourceNotFoundError)
        }
        await this.serviceRepository.delete(service)
        return right({})
    }
    
}