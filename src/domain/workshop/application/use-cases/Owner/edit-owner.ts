import { Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Owner } from "@/domain/workshop/enterprise/entities/owner"
import { OwnersRepository } from "../../repositories/owners-repository"
import { NotAllowedError } from "../errors/not-allowed-error"
import { ResourceNotFoundError } from "../errors/resource-not-found-error"

interface EditOwnerUseCaseRequest {
    name: string
    email: string
    password: string
    phoneNumber: string
    roles: string[]
}
type EditOwnerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError ,{owner: Owner}>
export class EditOwnerUseCase { 
    constructor(
        private ownerRepository: OwnersRepository,
    ){}
    async execute({name,email,password,phoneNumber,roles}: EditOwnerUseCaseRequest) : Promise<EditOwnerUseCaseResponse> {
        const owner = await this.ownerRepository.findByEmail(email);
        if(!owner){
            return left(new ResourceNotFoundError)
        }
        owner.name = name
        owner.email = email
        owner.password = password
        owner.phoneNumber = phoneNumber
        owner.roles = roles
        await this.ownerRepository.save(owner)
        return right({owner})
    }
    
}