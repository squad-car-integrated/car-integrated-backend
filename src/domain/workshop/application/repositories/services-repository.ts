import { PaginationParams } from '@/core/repositories/pagination-params'
import { Service } from '../../enterprise/entities/service'

export abstract class ServicesRepository {
    abstract findById(id: string): Promise<Service | null>
    abstract findManyRecent(params: PaginationParams): Promise<Service[]>
    abstract create(service: Service): Promise<void>
    abstract save(service: Service): Promise<void>
    abstract delete(service: Service): Promise<void>
}
