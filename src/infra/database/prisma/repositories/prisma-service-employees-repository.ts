import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ServiceEmployeesRepository } from '@/domain/workshop/application/repositories/service-employees-repository'
import { PrismaServiceEmployeesMapper } from '../mappers/prisma-service-employees-mapper'
import { ServiceEmployee } from '@/domain/workshop/enterprise/entities/service-employees'

@Injectable()
export class PrismaServiceEmployeesRepository
    implements ServiceEmployeesRepository
{
    constructor(private prisma: PrismaService) {}
    async findManyByServiceId(
        serviceId: string,
    ): Promise<ServiceEmployee[]> {
        const serviceEmployees = await this.prisma.serviceEmployees.findMany({
            where: {
                serviceId,
            },
        })
        return serviceEmployees.map(PrismaServiceEmployeesMapper.toDomain)
    }
    async deleteManyByServiceId(serviceId: string): Promise<void> {
        await this.prisma.serviceEmployees.deleteMany({
            where: {
                serviceId,
            },
        })
    }
    async create(serviceEmployee: ServiceEmployee): Promise<void> {
        const data = PrismaServiceEmployeesMapper.toPrisma(serviceEmployee)
        await this.prisma.serviceEmployees.create({
          data,
        })
    }
}
