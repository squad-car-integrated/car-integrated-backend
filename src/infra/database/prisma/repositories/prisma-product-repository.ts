import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Product } from '@/domain/workshop/enterprise/entities/product'
import { ProductsRepository } from '@/domain/workshop/application/repositories/products-repository'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
    constructor(private prisma: PrismaService) {}
    async findManyRecent(params: PaginationParams): Promise<Product[]> {
        const products = await this.prisma.product.findMany({
            take: 20,
            skip: (params.page - 1) * 20,
            orderBy: {
                name: 'desc',
            },
        })
        return products.map(PrismaProductMapper.toDomain)
    }
    async findById(id: string): Promise<Product | null> {
        const product = await this.prisma.product.findUnique({
            where: {
                id,
            },
        })
        if (!product) {
            return null
        }
        return PrismaProductMapper.toDomain(product)
    }
    async save(product: Product): Promise<void> {
        const data = PrismaProductMapper.toPrisma(product)

        await this.prisma.product.update({
            where: {
                id: data.id,
            },
            data,
        })
    }
    async delete(product: Product): Promise<void> {
        await this.prisma.product.delete({
            where: {
                id: product.id.toString(),
            },
        })
    }
    async create(product: Product): Promise<void> {
        const data = PrismaProductMapper.toPrisma(product)
        await this.prisma.product.create({
            data,
        })
    }
    async getNumberOfPages(){
        const numberOfAutomobiles = await this.prisma.product.count();
        const carsPerPage = 20;
        const totalPages = Math.ceil(numberOfAutomobiles / carsPerPage);
        return totalPages;
    }
}
