import { Either, left, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { OwnersRepository } from '../../repositories/owners-repository'

interface GetOwnerByEmailUseCaseRequest {
  email: string
}
type GetOwnerByEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  { owner: Owner }
>
export class GetOwnerByEmailUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    email,
  }: GetOwnerByEmailUseCaseRequest): Promise<GetOwnerByEmailUseCaseResponse> {
    const owner = await this.ownerRepository.findByEmail(email)
    if (!owner) {
      return left(new ResourceNotFoundError())
    }
    return right({
      owner,
    })
  }
}
