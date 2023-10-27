import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/workshop/enterprise/entities/product'
import { PrismaProductMapper } from '@/infra/database/prisma/mappers/prisma-product-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      name: faker.commerce.productName(),
      unitValue: Number(faker.commerce.price()),
      productAmount: faker.number.int({ min: 10, max: 100 }),
      description: faker.commerce.productDescription(),
      photo: faker.image.url(),
      ...override,
    },
    id,
  )
  return product
}

@Injectable()
export class ProductFactory {
    constructor(private prisma: PrismaService) {}
    async makePrismaProduct(
        data: Partial<ProductProps> = {},
    ): Promise<Product> {
        const product = makeProduct(data)
        await this.prisma.product.create({
            data: PrismaProductMapper.toPrisma(product),
        })
        return product
    }
}
