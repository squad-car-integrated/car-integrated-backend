import { ServiceStatus } from '@/core/entities/service-status-enum'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Service,
  ServiceProps,
} from '@/domain/workshop/enterprise/entities/service'
import { faker } from '@faker-js/faker'
export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityID,
) {
  const service = Service.create(
    {
      totalValue: faker.number.int(),
      ownerId: new UniqueEntityID(),
      automobileId: new UniqueEntityID(),
      description: 'Troca de oleo',
      status: ServiceStatus.InProgress,
      ...override,
    },
    id,
  )
  return service
}
