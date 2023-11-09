import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { EmployeesRepository } from '@/domain/workshop/application/repositories/employees-repository'
import { PrismaEmployeeMapper } from '../mappers/prisma-employee-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
    constructor(private prisma: PrismaService) {}
    async getAll(params: PaginationParams): Promise<Employee[]> {
        const employee = await this.prisma.employee.findMany({
            take: 20,
            skip: (params.page - 1) * 20,
            orderBy: {
                name: 'desc',
            },
        })
        return employee.map(PrismaEmployeeMapper.toDomain)
    }
    async findById(id: string): Promise<Employee | null> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id,
            },
        })
        if (!employee) {
            return null
        }
        return PrismaEmployeeMapper.toDomain(employee)
    }
    async save(employee: Employee): Promise<void> {
        const data = PrismaEmployeeMapper.toPrisma(employee)

        await this.prisma.employee.update({
            where: {
                id: data.id,
            },
            data,
        })
    }
    async delete(employee: Employee): Promise<void> {
        await this.prisma.employee.delete({
            where: {
                id: employee.id.toString(),
            },
        })
    }
    async findByEmail(email: string): Promise<Employee | null> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                email,
            },
        })
        if (!employee) {
            return null
        }
        return PrismaEmployeeMapper.toDomain(employee)
    }
    async create(employee: Employee): Promise<void> {
        const data = PrismaEmployeeMapper.toPrisma(employee)
        await this.prisma.employee.create({
            data,
        })
    }
}
