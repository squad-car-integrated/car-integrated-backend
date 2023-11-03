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
                productId: new UniqueEntityID(raw.id),
                serviceId: new UniqueEntityID(raw.serviceId),
            },
            new UniqueEntityID(raw.id),
        )
    }
}
