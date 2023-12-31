import { Service } from '@/domain/workshop/enterprise/entities/service'

export class ServicePresenter {
    static toHTTP(service: Service) {
        return {
            id: service.id.toString(),
            labourValue: service.laborValue,
            productsTotalValue: service.productsTotalValue,
            automobileId: service.automobileId.toString(),
            employees: service.employees.listToString(),
            products: service.products.listToString(),
            description: service.description,
            status: service.status,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        }
    }
}
