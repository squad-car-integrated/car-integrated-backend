import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ServiceProductsRepository } from '@/domain/workshop/application/repositories/service-products-repository'
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'
import { PrismaServiceProductsMapper } from '../mappers/prisma-service-products-mapper'

@Injectable()
export class PrismaServiceProductsRepository
    implements ServiceProductsRepository
{
    constructor(private prisma: PrismaService) {}
    async findManyByServiceId(
        serviceId: string,
    ): Promise<ServiceProduct[]> {
        const serviceProducts = await this.prisma.serviceProducts.findMany({
            where: {
                serviceId,
            },
        })
        return serviceProducts.map(PrismaServiceProductsMapper.toDomain)
    }
    async deleteManyByServiceId(serviceId: string): Promise<void> {
        await this.prisma.serviceProducts.deleteMany({
            where: {
                serviceId,
            },
        })
    }
    async create(serviceProduct: ServiceProduct): Promise<void> {
        const data = PrismaServiceProductsMapper.toPrisma(serviceProduct)
        await this.prisma.serviceProducts.create({
          data,
        })
    }
}
