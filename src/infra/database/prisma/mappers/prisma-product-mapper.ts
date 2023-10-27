import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/workshop/enterprise/entities/product'
import {
  Product as PrismaProduct,
  Prisma,
} from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        name: raw.name,
        unitValue: raw.unitValue,
        productAmount: raw.productAmount,
        description: raw.description,
        photo: raw.photo,
      },
      new UniqueEntityID(raw.id),
    )
  }
  static toPrisma(
    product: Product,
  ): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      unitValue: product.unitValue,
      productAmount: product.productAmount,
      description: product.description,
      photo: product.photo,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
