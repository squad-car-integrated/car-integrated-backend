import { Either, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { Injectable } from '@nestjs/common'
import { OwnersRepository } from '../../repositories/owners-repository'

interface FetchAllOwnersUseCaseRequest {
  page: number
}
type FetchAllOwnersUseCaseResponse = Either<null, { owners: Owner[] }>
@Injectable()
export class FetchAllOwnersUseCase {
  constructor(private ownerRepository: OwnersRepository) {}
  async execute({
    page,
  }: FetchAllOwnersUseCaseRequest): Promise<FetchAllOwnersUseCaseResponse> {
    const owners = await this.ownerRepository.getAll({ page })
    return right({
      owners,
    })
  }
}
