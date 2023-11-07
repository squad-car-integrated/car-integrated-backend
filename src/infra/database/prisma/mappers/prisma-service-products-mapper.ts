import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ServiceProduct } from '@/domain/workshop/enterprise/entities/service-products'
import { ServiceProducts as PrismaProduct, Prisma } from '@prisma/client'

export class PrismaServiceProductsMapper {
    static toDomain(raw: PrismaProduct): ServiceProduct {
        if (!raw.serviceId) {
            throw new Error('Invalid product type.')
        }
        return ServiceProduct.create(
            {
                productId: new UniqueEntityID(raw.productId),
                serviceId: new UniqueEntityID(raw.serviceId),
                quantity: raw.quantity
            },
            new UniqueEntityID(raw.id),
        )
    }
    static toPrisma(service: ServiceProduct): Prisma.ServiceProductsUncheckedCreateInput {
        return {
            id: service.id.toString(),
            serviceId: service.serviceId.toString(),
            productId: service.productId.toString(),
            quantity: service.quantity
        }
    }
}
