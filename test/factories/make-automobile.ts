import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Automobile,
  AutomobileProps,
} from '@/domain/workshop/enterprise/entities/automobile'
import { faker } from '@faker-js/faker'
export function makeAutomobile(
  override: Partial<AutomobileProps> = {},
  id?: UniqueEntityID,
) {
  const automobile = Automobile.create(
    {
      model: faker.vehicle.model(),
      brand: faker.vehicle.manufacturer(),
      plate: faker.vehicle.vrm(),
      ownerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
  return automobile
}
