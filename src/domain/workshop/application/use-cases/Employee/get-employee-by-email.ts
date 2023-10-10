import { Either, left, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { Injectable } from '@nestjs/common'

interface GetEmployeeByEmailUseCaseRequest {
  email: string
}
type GetEmployeeByEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  { employee: Employee }
>
@Injectable()
export class GetEmployeeByEmailUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    email,
  }: GetEmployeeByEmailUseCaseRequest): Promise<GetEmployeeByEmailUseCaseResponse> {
    const employee = await this.employeeRepository.findByEmail(email)
    if (!employee) {
      return left(new ResourceNotFoundError())
    }
    return right({
      employee,
    })
  }
}
