import { Either, left, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { OwnersRepository } from '../../repositories/owners-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditOwnerUseCaseRequest {
  ownerId: string
  name: string
  email: string
  password: string
  phoneNumber: string
}
type EditOwnerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { owner: Owner }
>
@Injectable()
export class EditOwnerUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    ownerId,
    name,
    email,
    password,
    phoneNumber,
  }: EditOwnerUseCaseRequest): Promise<EditOwnerUseCaseResponse> {
    const owner = await this.ownerRepository.findById(ownerId)
    if (!owner) {
      return left(new ResourceNotFoundError())
    }
    owner.name = name
    owner.email = email
    owner.password = password
    owner.phoneNumber = phoneNumber
    await this.ownerRepository.save(owner)
    return right({ owner })
  }
}
