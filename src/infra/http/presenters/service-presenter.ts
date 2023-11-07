import { Service } from '@/domain/workshop/enterprise/entities/service'

export class ServicePresenter {
  static toHTTP(service: Service) {
    return {
      id: service.id.toString(),
      totalValue: service.totalValue,
      ownerId: service.ownerId.toString(),
      automobileId: service.automobileId.toString(),
      description: service.description,
      status: service.status,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }
  }
}
