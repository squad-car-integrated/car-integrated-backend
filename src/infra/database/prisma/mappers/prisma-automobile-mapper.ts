import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import {
  Automobile as PrismaAutomobile,
  Prisma,
  UserRole,
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
      model: automobile.model.toString(),
      brand: automobile.brand.toString(),
      plate: automobile.plate.toString(),
      ownerId: automobile.ownerId.toString(),
    }
  }
}
