import { Either, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { Injectable } from '@nestjs/common'
import { EmployeesRepository } from '../../repositories/employees-repository'

interface FetchAllEmployeesUseCaseRequest {
  page: number
}
type FetchAllEmployeesUseCaseResponse = Either<null, { employees: Employee[] }>
@Injectable()
export class FetchAllEmployeesUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    page,
  }: FetchAllEmployeesUseCaseRequest): Promise<FetchAllEmployeesUseCaseResponse> {
    const employees = await this.employeeRepository.getAll({ page })
    return right({
      employees,
    })
  }
}
