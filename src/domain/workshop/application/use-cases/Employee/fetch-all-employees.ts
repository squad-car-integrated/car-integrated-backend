import { Either, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Injectable } from '@nestjs/common'
import { EmployeesRepository } from '../../repositories/employees-repository'

interface FetchAllEmployeesUseCaseRequest {
    page: number
    name?: string
}
type FetchAllEmployeesUseCaseResponse = Either<null, { employees: Employee[], totalPages: number }>
@Injectable()
export class FetchAllEmployeesUseCase {
    constructor(private employeeRepository: EmployeesRepository) {}
    async execute({
        page,
        name
    }: FetchAllEmployeesUseCaseRequest): Promise<FetchAllEmployeesUseCaseResponse> {
        const employees = await this.employeeRepository.getAll({ page, name })
        const totalPages = await this.employeeRepository.getNumberOfPages()
        return right({
            employees,
            totalPages
        })
    }
}
