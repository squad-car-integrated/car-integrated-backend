import { Either, left, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditEmployeeUseCaseRequest {
  employeeId: string
  name: string
  email: string
  password: string
  monthWorkedHours: number
}
type EditEmployeeUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { employee: Employee }
>
@Injectable()
export class EditEmployeeUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    employeeId,
    name,
    email,
    password,
    monthWorkedHours,
  }: EditEmployeeUseCaseRequest): Promise<EditEmployeeUseCaseResponse> {
    const employee = await this.employeeRepository.findById(employeeId)
    if (!employee) {
      return left(new ResourceNotFoundError())
    }
    employee.name = name
    employee.email = email
    employee.password = password
    employee.monthWorkedHours = monthWorkedHours
    await this.employeeRepository.save(employee)
    return right({ employee })
  }
}
