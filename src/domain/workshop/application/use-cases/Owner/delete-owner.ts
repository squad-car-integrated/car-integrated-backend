import { Either, left, right } from '@/core/either'
import { OwnersRepository } from '../../repositories/owners-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteOwnerUseCaseRequest {
  ownerId: string
}
type DeleteOwnerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>
@Injectable()
export class DeleteOwnerUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    ownerId,
  }: DeleteOwnerUseCaseRequest): Promise<DeleteOwnerUseCaseResponse> {
    const owner = await this.ownerRepository.findById(ownerId)
    if (!owner) {
      return left(new ResourceNotFoundError())
    }
    await this.ownerRepository.delete(owner)
    return right({})
  }
}
