import { Either, left, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { OwnersRepository } from '../../repositories/owners-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditOwnerUseCaseRequest {
  name: string
  email: string
  password: string
  phoneNumber: string
}
type EditOwnerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { owner: Owner }
>
export class EditOwnerUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    name,
    email,
    password,
    phoneNumber,
  }: EditOwnerUseCaseRequest): Promise<EditOwnerUseCaseResponse> {
    const owner = await this.ownerRepository.findByEmail(email)
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
