import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Automobile,
  AutomobileProps,
} from '@/domain/workshop/enterprise/entities/automobile'
import { PrismaAutomobileMapper } from '@/infra/database/prisma/mappers/prisma-automobile-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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
@Injectable()
export class AutomobileFactory {
    constructor(private prisma: PrismaService) {}
    async makePrismaAutomobile(
        data: Partial<AutomobileProps> = {},
    ): Promise<Automobile> {
        const automobile = makeAutomobile(data)
        await this.prisma.automobile.create({
            data: PrismaAutomobileMapper.toPrisma(automobile),
        })
        return automobile
    }
}