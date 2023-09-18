import { Either, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { Injectable } from '@nestjs/common'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'

interface FetchRecentAutomobilesUseCaseRequest {
  page: number
}
type FetchRecentAutomobilesUseCaseResponse = Either<
  null,
  { automobiles: Automobile[] }
>
@Injectable()
export class FetchRecentAutomobilesUseCase {
  constructor(private automobileRepository: AutomobilesRepository) {}
  async execute({
    page,
  }: FetchRecentAutomobilesUseCaseRequest): Promise<FetchRecentAutomobilesUseCaseResponse> {
    const automobiles = await this.automobileRepository.findManyRecent({
      page,
    })
    return right({
      automobiles,
    })
  }
}
