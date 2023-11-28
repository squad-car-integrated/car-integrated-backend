import { Either, right } from '@/core/either'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { Injectable } from '@nestjs/common'
import { OwnersRepository } from '../../repositories/owners-repository'

interface FetchAllOwnersUseCaseRequest {
    page: number
    name: string
}
type FetchAllOwnersUseCaseResponse = Either<null, { owners: Owner[], totalPages: number }>
@Injectable()
export class FetchAllOwnersUseCase {
    constructor(private ownerRepository: OwnersRepository) {}
    async execute({
        page,
        name
    }: FetchAllOwnersUseCaseRequest): Promise<FetchAllOwnersUseCaseResponse> {
        const owners = await this.ownerRepository.getAll({ page, name })
        const totalPages = await this.ownerRepository.getNumberOfPages()
        return right({
            owners,
            totalPages
        })
    }
}
