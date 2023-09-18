import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from '@/domain/workshop/enterprise/entities/product'
import { faker } from '@faker-js/faker'
export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      name: faker.commerce.productName(),
      unitValue: Number(faker.commerce.price()),
      productAmout: faker.number.int({ min: 10, max: 100 }),
      description: faker.commerce.productDescription(),
      photo: faker.image.url(),
      ...override,
    },
    id,
  )
  return product
}
