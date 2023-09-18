import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Automobile } from '../../../enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
interface CreateAutomobileUseCaseRequest {
  model: string
  brand: string
  plate: string
  ownerId: string
}
type CreateAutomobileUseCaseResponse = Either<
  null,
  {
    automobile: Automobile
  }
>
@Injectable()
export class CreateAutomobileUseCase {
  constructor(private automobileRepository: AutomobilesRepository) {}
  async execute({
    model,
    brand,
    plate,
    ownerId,
  }: CreateAutomobileUseCaseRequest): Promise<CreateAutomobileUseCaseResponse> {
    const automobile = Automobile.create({
      model,
      brand,
      plate,
      ownerId: new UniqueEntityID(ownerId),
    })
    await this.automobileRepository.create(automobile)
    return right({
      automobile,
    })
  }
}
