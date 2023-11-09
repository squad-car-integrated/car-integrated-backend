import { Either, left, right } from '@/core/either'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteAutomobileUseCaseRequest {
    automobileId: string
}
type DeleteAutomobileUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>
@Injectable()
export class DeleteAutomobileUseCase {
    constructor(private automobileRepository: AutomobilesRepository) {}
    async execute({
        automobileId,
    }: DeleteAutomobileUseCaseRequest): Promise<DeleteAutomobileUseCaseResponse> {
        const automobile =
            await this.automobileRepository.findById(automobileId)
        if (!automobile) {
            return left(new ResourceNotFoundError())
        }
        await this.automobileRepository.delete(automobile)
        return right({})
    }
}
