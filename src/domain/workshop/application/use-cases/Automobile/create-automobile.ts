import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Automobile } from '../../../enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AutomobileAlreadyExistsError } from '../errors/automobile-already-exists-error'
interface CreateAutomobileUseCaseRequest {
    model: string
    brand: string
    plate: string
    ownerId: string
}
type CreateAutomobileUseCaseResponse = Either<
    AutomobileAlreadyExistsError | BadRequestException,
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
        const autoAlreadyExists =
            await this.automobileRepository.findByPlate(plate)
        if (autoAlreadyExists.length > 0) {
            return left(new AutomobileAlreadyExistsError(plate))
        }
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
