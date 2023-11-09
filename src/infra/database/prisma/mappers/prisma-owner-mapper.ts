import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Owner } from '@/domain/workshop/enterprise/entities/owner'
import { Owner as PrismaOwner, Prisma } from '@prisma/client'

export class PrismaOwnerMapper {
    static toDomain(raw: PrismaOwner): Owner {
        return Owner.create(
            {
                name: raw.name,
                email: raw.email,
                password: raw.password,
                phoneNumber: raw.phoneNumber,
            },
            new UniqueEntityID(raw.id),
        )
    }
    static toPrisma(owner: Owner): Prisma.OwnerUncheckedCreateInput {
        return {
            id: owner.id.toString(),
            name: owner.name,
            email: owner.email,
            password: owner.password,
            phoneNumber: owner.phoneNumber,
        }
    }
}
