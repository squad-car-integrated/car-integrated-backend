import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees'
import { ServiceEmployees as PrismaEmployee, Prisma } from '@prisma/client'

export class PrismaServiceEmployeesMapper {
    static toDomain(raw: PrismaEmployee): ServiceEmployee {
        if (!raw.serviceId) {
            throw new Error('Invalid employee type.')
        }
        return ServiceEmployee.create(
            {
                employeeId: new UniqueEntityID(raw.id),
                serviceId: new UniqueEntityID(raw.serviceId),
            },
            new UniqueEntityID(raw.id),
        )
    }
}
