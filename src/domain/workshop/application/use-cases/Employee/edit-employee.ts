import { Either, left, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditEmployeeUseCaseRequest {
  name: string
  email: string
  password: string
  monthWorkedHours: number
  roles: string[]
}
type EditEmployeeUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { employee: Employee }
>
export class EditEmployeeUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    name,
    email,
    password,
    monthWorkedHours,
    roles,
  }: EditEmployeeUseCaseRequest): Promise<EditEmployeeUseCaseResponse> {
    const employee = await this.employeeRepository.findByEmail(email)
    if (!employee) {
      return left(new ResourceNotFoundError())
    }
    employee.name = name
    employee.email = email
    employee.password = password
    employee.monthWorkedHours = monthWorkedHours
    employee.roles = roles
    await this.employeeRepository.save(employee)
    return right({ employee })
  }
}
