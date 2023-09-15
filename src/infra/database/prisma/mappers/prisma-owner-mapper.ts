import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Owner } from "@/domain/workshop/enterprise/entities/owner"
import { Owner as PrismaOwner, Prisma, UserRole } from "@prisma/client";

export class PrismaOwnerMapper {
    static toDomain(raw: PrismaOwner): Owner {
        return Owner.create({
            name: raw.name,
            email: raw.email,
            password: raw.password,
            phoneNumber: raw.phoneNumber,
            roles: [raw.role],

        }, new UniqueEntityID(raw.id))
    }
    static toPrisma(owner: Owner):Prisma.OwnerUncheckedCreateInput {
        return {
            name: owner.name,
            email: owner.email,
            password: owner.password,
            phoneNumber: owner.phoneNumber,
            role: UserRole.OWNER,
        }
    }
}