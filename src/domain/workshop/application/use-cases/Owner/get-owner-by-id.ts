import { Either, left, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { OwnersRepository } from '../../repositories/owners-repository'
import { Injectable } from '@nestjs/common'

interface GetOwnerByIdUseCaseRequest {
  id: string
}
type GetOwnerByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { owner: Owner }
>
@Injectable()
export class GetOwnerByIdUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    id,
  }: GetOwnerByIdUseCaseRequest): Promise<GetOwnerByIdUseCaseResponse> {
    const owner = await this.ownerRepository.findById(id)
    if (!owner) {
      return left(new ResourceNotFoundError())
    }
    return right({
      owner,
    })
  }
}
