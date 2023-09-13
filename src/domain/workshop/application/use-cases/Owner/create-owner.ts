import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { OwnerRepository } from "../../repositories/owner-repository"
import { Owner } from "../../../enterprise/entities/owner"
interface CreateOwnerUseCaseRequest {
    phoneNumber: string
    name: string
    email: string
    password: string
}
type CreateOwnerUseCaseResponse = Either<null, {
    owner: Owner
}>
@Injectable()
export class CreateOwnerUseCase { 
    constructor(
        private ownerRepository: OwnerRepository,
    ){}
    async execute({phoneNumber, name, email, password}: CreateOwnerUseCaseRequest) : Promise<CreateOwnerUseCaseResponse> {
        const owner = Owner.create({
            phoneNumber,
            name,
            email,
            password,
        })
        await this.ownerRepository.create(owner)
        return right({
            owner
        })
    }
    
}