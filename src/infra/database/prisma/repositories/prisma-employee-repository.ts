import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { Employee } from "@/domain/workshop/enterprise/entities/employee"
import { EmployeesRepository } from "@/domain/workshop/application/repositories/employees-repository"
import { PrismaEmployeeMapper } from "../mappers/prisma-employee-mapper"

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
    constructor(private prisma: PrismaService) {
        
    }
    async findById(id: string): Promise<Employee | null> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                id,
            }
        })
        if(!employee){
            return null
        }
        return PrismaEmployeeMapper.toDomain(employee)
    }
    save(employee: Employee): Promise<void> {
        throw new Error("Method not implemented.")
    }
    async delete(employee: Employee): Promise<void> {
        await this.prisma.employee.delete({
            where: {
                id: employee.id.toString()
            }
        })
    }
    async findByEmail(email: string): Promise<Employee | null> {
        const employee = await this.prisma.employee.findUnique({
            where: {
                email,
            }
        })
        if(!employee){
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