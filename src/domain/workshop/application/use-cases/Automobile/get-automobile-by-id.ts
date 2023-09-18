import { Either, left, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetAutomobileByIdUseCaseRequest {
  id: string
}
type GetAutomobileByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { automobile: Automobile }
>
export class GetAutomobileByIdUseCase {
  constructor(private automobileRepository: AutomobilesRepository) {}
  async execute({
    id,
  }: GetAutomobileByIdUseCaseRequest): Promise<GetAutomobileByIdUseCaseResponse> {
    const automobile = await this.automobileRepository.findById(id)
    if (!automobile) {
      return left(new ResourceNotFoundError())
    }
    return right({
      automobile,
    })
  }
}
