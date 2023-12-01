import { ServiceStatus } from '@/core/entities/service-status-enum'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Service } from '@/domain/workshop/enterprise/entities/service'
import { Service as PrismaService, Prisma } from '@prisma/client'

export class PrismaServiceMapper {
    static toDomain(raw: PrismaService): Service {
        return Service.create(
            {
                automobileId: new UniqueEntityID(raw.automobileId),
                description: raw.description,
                laborValue: raw.laborValue,
                productsTotalValue: raw.productsTotalValue,
                status: raw.status as ServiceStatus,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id),
        )
    }
    static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
        return {
            id: service.id.toString(),
            automobileId: service.automobileId.toString(),
            description: service.description,
            laborValue: service.laborValue,
            productsTotalValue: service.productsTotalValue,
            status: service.status,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        }
    }
}
