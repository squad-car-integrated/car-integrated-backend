import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { OwnersRepository } from '../../repositories/owners-repository'
import { Owner } from '../../../enterprise/entities/owner'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { HashGenerator } from '../../cryptography/hasher-generator'
interface CreateOwnerUseCaseRequest {
    phoneNumber: string
    name: string
    email: string
    password: string
}
type CreateOwnerUseCaseResponse = Either<
    UserAlreadyExistsError | BadRequestException,
    {
        owner: Owner
    }
>
@Injectable()
export class CreateOwnerUseCase {
    constructor(
        private ownersRepository: OwnersRepository,
        private hashGenerator: HashGenerator,
    ) {}
    async execute({
        phoneNumber,
        name,
        email,
        password,
    }: CreateOwnerUseCaseRequest): Promise<CreateOwnerUseCaseResponse> {
        const ownerWithSameEmail =
            await this.ownersRepository.findByEmail(email)
        if (ownerWithSameEmail) {
            return left(new UserAlreadyExistsError(email))
        }
        const hashedPassword = await this.hashGenerator.hash(password)
        const owner = Owner.create({
            phoneNumber,
            name,
            email,
            password: hashedPassword,
        })
        await this.ownersRepository.create(owner)
        return right({
            owner,
        })
    }
}
