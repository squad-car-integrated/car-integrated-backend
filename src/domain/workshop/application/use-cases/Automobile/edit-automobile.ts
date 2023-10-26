import { Either, left, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditAutomobileUseCaseRequest {
  model: string
  automobileId: string
  brand: string
  plate: string
  ownerId: string
}
type EditAutomobileUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { automobile: Automobile }
>
@Injectable()
export class EditAutomobileUseCase {
  constructor(private automobileRepository: AutomobilesRepository) {}
  async execute({
    model,
    brand,
    plate,
    ownerId,
    automobileId,
  }: EditAutomobileUseCaseRequest): Promise<EditAutomobileUseCaseResponse> {
    const automobile = await this.automobileRepository.findById(automobileId)
    if (!automobile) {
      return left(new ResourceNotFoundError())
    }
    automobile.model = model
    automobile.brand = brand
    automobile.plate = plate
    automobile.ownerId = new UniqueEntityID(ownerId)
    await this.automobileRepository.save(automobile)
    return right({ automobile })
  }
}
