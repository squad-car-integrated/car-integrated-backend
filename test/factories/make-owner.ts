import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner, OwnerProps } from '@/domain/workshop/enterprise/entities/owner'
import { PrismaOwnerMapper } from '@/infra/database/prisma/mappers/prisma-owner-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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
      ...override,
    },
    id,
  )
  return owner
}
@Injectable()
export class OwnerFactory {
    constructor(private prisma: PrismaService) {}
    async makePrismaOwner(
        data: Partial<OwnerProps> = {},
    ): Promise<Owner> {
        const owner = makeOwner(data)
        await this.prisma.owner.create({
            data: PrismaOwnerMapper.toPrisma(owner),
        })
        return owner
    }
}