import { PaginationParams } from '@/core/repositories/pagination-params'
import { Automobile } from '../../enterprise/entities/automobile'

export abstract class AutomobilesRepository {
    abstract findById(id: string): Promise<Automobile | null>
    abstract findByPlate(plate: string): Promise<Automobile | null>
    abstract findManyRecent(params: PaginationParams): Promise<Automobile[]>
    abstract create(automobile: Automobile): Promise<void>
    abstract save(automobile: Automobile): Promise<void>
    abstract delete(automobile: Automobile): Promise<void>
}
