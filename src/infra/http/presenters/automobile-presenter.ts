import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'

export class AutomobilePresenter {
    static toHTTP(automobile: Automobile) {
        return {
            id: automobile.id.toString(),
            ownerId: automobile.ownerId.toString(),
            model: automobile.model,
            brand: automobile.brand,
            plate: automobile.plate,
            createdAt: automobile.createdAt,
            updatedAt: automobile.updatedAt,
        }
    }
}
