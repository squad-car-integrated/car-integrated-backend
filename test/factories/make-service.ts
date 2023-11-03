import { ServiceStatus } from '@/core/entities/service-status-enum'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Service,
  ServiceProps,
} from '@/domain/workshop/enterprise/entities/service'
import { PrismaServiceMapper } from '@/infra/database/prisma/mappers/prisma-service-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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
@Injectable()
export class ServiceFactory {
    constructor(private prisma: PrismaService) {}
    async makePrismaService(
        data: Partial<ServiceProps> = {},
    ): Promise<Service> {
        const service = makeService(data)
        await this.prisma.service.create({
            data: PrismaServiceMapper.toPrisma(service),
        })
        return service
    }
}