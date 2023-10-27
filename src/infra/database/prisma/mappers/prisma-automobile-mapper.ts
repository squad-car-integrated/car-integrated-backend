import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import {
  Automobile as PrismaAutomobile,
  Prisma,
} from '@prisma/client'

export class PrismaAutomobileMapper {
  static toDomain(raw: PrismaAutomobile): Automobile {
    return Automobile.create(
      {
        model: raw.model,
        brand: raw.brand,
        plate: raw.plate,
        ownerId: new UniqueEntityID(raw.ownerId),
      },
      new UniqueEntityID(raw.id),
    )
  }
  static toDomainMany(rawList: PrismaAutomobile[]): Automobile[] {
    return rawList.map((raw) => this.toDomain(raw));
  }
  static toPrisma(
    automobile: Automobile,
  ): Prisma.AutomobileUncheckedCreateInput {
    return {
      id: automobile.id.toString(),
      model: automobile.model,
      brand: automobile.brand,
      plate: automobile.plate,
      ownerId: automobile.ownerId.toString(),
    }
  }
}
