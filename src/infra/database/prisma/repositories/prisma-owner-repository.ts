import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { Owner } from "@/domain/workshop/enterprise/entities/owner"
import { OwnersRepository } from "@/domain/workshop/application/repositories/owners-repository"
import { PrismaOwnerMapper } from "../mappers/prisma-owner-mapper"

@Injectable()
export class PrismaOwnersRepository implements OwnersRepository {
    constructor(private prisma: PrismaService) {
        
    }
    async findById(id: string): Promise<Owner | null> {
        const owner = await this.prisma.owner.findUnique({
            where: {
                id,
            }
        })
        if(!owner){
            return null
        }
        return PrismaOwnerMapper.toDomain(owner)
    }
    save(owner: Owner): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async delete(owner: Owner): Promise<void> {
        await this.prisma.owner.delete({
            where: {
                id: owner.id.toString()
            }
        })
    }
    async findByEmail(email: string): Promise<Owner | null> {
        const owner = await this.prisma.owner.findUnique({
            where: {
                email,
            }
        })
        if(!owner){
            return null
        }
        return PrismaOwnerMapper.toDomain(owner)
    }
    async create(owner: Owner): Promise<void> {
        const data = PrismaOwnerMapper.toPrisma(owner)
        await this.prisma.owner.create({
            data,
        })
    }
    
}