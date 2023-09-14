import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { OwnersRepository } from "../../repositories/owners-repository"
import { Owner } from "../../../enterprise/entities/owner"
interface CreateOwnerUseCaseRequest {
    phoneNumber: string
    name: string
    email: string
    password: string
    roles: string[]
}
type CreateOwnerUseCaseResponse = Either<null, {
    owner: Owner
}>
@Injectable()
export class CreateOwnerUseCase { 
    constructor(
        private ownersRepository: OwnersRepository,
    ){}
    async execute({phoneNumber, name, email, password,roles}: CreateOwnerUseCaseRequest) : Promise<CreateOwnerUseCaseResponse> {
        const owner = Owner.create({
            phoneNumber,
            name,
            email,
            password,
            roles
        })
        await this.ownersRepository.create(owner)
        return right({
            owner
        })
    }
    
}