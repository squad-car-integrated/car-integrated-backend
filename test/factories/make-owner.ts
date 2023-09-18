import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner, OwnerProps } from '@/domain/workshop/enterprise/entities/owner'
import { faker } from '@faker-js/faker'
export function makeOwner(
  override: Partial<OwnerProps> = {},
  id?: UniqueEntityID,
) {
  const owner = Owner.create(
    {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: ['User'],
      ...override,
    },
    id,
  )
  return owner
}
