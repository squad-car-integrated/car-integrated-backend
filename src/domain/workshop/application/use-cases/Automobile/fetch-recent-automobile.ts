import { Either, right } from '@/core/either'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { Injectable } from '@nestjs/common'
import { AutomobilesRepository } from '../../repositories/automobiles-repository'

interface FetchRecentAutomobilesUseCaseRequest {
    page: number
}
type FetchRecentAutomobilesUseCaseResponse = Either<
    null,
    { automobiles: Automobile[], totalPages: number }
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
        const totalPages = await this.automobileRepository.getNumberOfPages()
        return right({
            automobiles,
            totalPages
        })
    }
}
