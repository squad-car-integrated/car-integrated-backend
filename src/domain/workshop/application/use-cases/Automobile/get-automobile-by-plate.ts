import { Either, left, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface GetAutomobileByPlateUseCaseRequest {
    plate: string
}
type GetAutomobileByPlateUseCaseResponse = Either<
    null,
    { automobiles: Automobile[] }
>
@Injectable()
export class GetAutomobileByPlateUseCase {
    constructor(private automobileRepository: AutomobilesRepository) {}
    async execute({
        plate,
    }: GetAutomobileByPlateUseCaseRequest): Promise<GetAutomobileByPlateUseCaseResponse> {
        const automobiles = await this.automobileRepository.findByPlate(plate)
        return right({
            automobiles,
        })
    }
}
