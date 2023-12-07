import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Automobile } from '@/domain/workshop/enterprise/entities/automobile'
import { AutomobilesRepository } from '@/domain/workshop/application/repositories/automobiles-repository'
import { PrismaAutomobileMapper } from '../mappers/prisma-automobile-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaAutomobilesRepository implements AutomobilesRepository {
    constructor(private prisma: PrismaService) {}
    async findManyRecent(params: PaginationParams): Promise<Automobile[]> {
        const automobiles = await this.prisma.automobile.findMany({
            take: 20,
            skip: (params.page - 1) * 20,
            orderBy: {
                createdAt: 'desc',
            },
        })
        return PrismaAutomobileMapper.toDomainMany(automobiles)
    }
    async findById(id: string): Promise<Automobile | null> {
        console.log(id)
        const automobile = await this.prisma.automobile.findUnique({
            where: {
                id,
            },
        })
        if (!automobile) {
            return null
        }
        return PrismaAutomobileMapper.toDomain(automobile)
    }
    async save(automobile: Automobile): Promise<void> {
        const data = PrismaAutomobileMapper.toPrisma(automobile)

        await this.prisma.automobile.update({
            where: {
                id: automobile.id.toString(),
            },
            data,
        })
    }
    async delete(automobile: Automobile): Promise<void> {
        await this.prisma.automobile.delete({
            where: {
                id: automobile.id.toString(),
            },
        })
    }
    async findByPlate(plate: string): Promise<Automobile[]> {
        const automobile = await this.prisma.automobile.findMany({
            where: {
                plate:{
                    contains: plate,
                    mode: "insensitive"
                },
            },
        })
        return PrismaAutomobileMapper.toDomainMany(automobile)
    }
    async create(automobile: Automobile): Promise<void> {
        const data = PrismaAutomobileMapper.toPrisma(automobile)
        await this.prisma.automobile.create({
            data,
        })
    }
    async getNumberOfPages(){
        const numberOfAutomobiles = await this.prisma.automobile.count();
        const carsPerPage = 20;
        const totalPages = Math.ceil(numberOfAutomobiles / carsPerPage);
        return totalPages;
    }
}
