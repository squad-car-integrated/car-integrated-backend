import { Either, left, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetAutomobileByPlateUseCaseRequest {
  plate: string
}
type GetAutomobileByPlateUseCaseResponse = Either<
  ResourceNotFoundError,
  { automobile: Automobile }
>
export class GetAutomobileByPlateUseCase {
  constructor(private automobileRepository: AutomobilesRepository) {}
  async execute({
    plate,
  }: GetAutomobileByPlateUseCaseRequest): Promise<GetAutomobileByPlateUseCaseResponse> {
    const automobile = await this.automobileRepository.findByPlate(plate)
    if (!automobile) {
      return left(new ResourceNotFoundError())
    }
    return right({
      automobile,
    })
  }
}
