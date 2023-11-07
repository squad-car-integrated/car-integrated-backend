import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ServiceProduct,
  ServiceProductsProps,
} from '@/domain/workshop/enterprise/entities/service-products'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { faker } from '@faker-js/faker'
export function makeServiceProduct(
  override: Partial<ServiceProductsProps> = {},
  id?: UniqueEntityID,
) {
  const serviceproduct = ServiceProduct.create(
    {
      serviceId: new UniqueEntityID(),
      productId: new UniqueEntityID(),
      quantity: faker.number.int(20),
      ...override,
    },
    id,
  )
  return serviceproduct
}
@Injectable()
export class ServiceProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaServiceProduct(
    data: Partial<ServiceProductsProps> = {},
  ): Promise<ServiceProduct> {
    const serviceProduct = makeServiceProduct(data)
    await this.prisma.serviceProducts.update({
      where: {
        id: serviceProduct.id.toString(),
      },
      data: {
        productId: serviceProduct.productId.toString(),
      },
    })

    return serviceProduct
  }
}