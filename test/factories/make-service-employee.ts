import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    ServiceEmployee,
    ServiceEmployeesProps,
} from '@/domain/workshop/enterprise/entities/service-employees'
import { PrismaServiceEmployeesMapper } from '@/infra/database/prisma/mappers/prisma-service-employees-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeServiceEmployee(
    override: Partial<ServiceEmployeesProps> = {},
    id?: UniqueEntityID,
) {
    const serviceemployee = ServiceEmployee.create(
        {
            serviceId: new UniqueEntityID(),
            employeeId: new UniqueEntityID(),
            ...override,
        },
        id,
    )
    return serviceemployee
}
@Injectable()
export class ServiceEmployeeFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaServiceEmployee(
        data: Partial<ServiceEmployeesProps> = {},
    ): Promise<ServiceEmployee> {
        const serviceEmployee = makeServiceEmployee(data)
        const serviceEmployeeExists =
            await this.prisma.serviceEmployees.findUnique({
                where: {
                    id: serviceEmployee.id.toString(),
                },
            })
        if (serviceEmployeeExists) {
            await this.prisma.serviceEmployees.update({
                where: {
                    id: serviceEmployee.id.toString(),
                },
                data: {
                    employeeId: serviceEmployee.employeeId.toString(),
                },
            })
        } else {
            await this.prisma.serviceEmployees.create({
                data: PrismaServiceEmployeesMapper.toPrisma(serviceEmployee),
            })
        }
        return serviceEmployee
    }
}
