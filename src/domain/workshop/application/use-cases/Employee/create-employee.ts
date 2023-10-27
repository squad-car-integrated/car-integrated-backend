import { Either, left, right } from '@/core/either'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { Employee } from '../../../enterprise/entities/employee'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { HashGenerator } from '../../cryptography/hasher-generator'
import { UserRole } from '@/core/entities/user-role-enum'
interface CreateEmployeeUseCaseRequest {
  monthWorkedHours: number
  name: string
  email: string
  password: string
}
type CreateEmployeeUseCaseResponse = Either<
  UserAlreadyExistsError | BadRequestException,
  {
    employee: Employee
  }
>
@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeesRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    monthWorkedHours,
    email,
    password,
  }: CreateEmployeeUseCaseRequest): Promise<CreateEmployeeUseCaseResponse> {
    const employeeWithSameEmail =
      await this.employeeRepository.findByEmail(email)
    if (employeeWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }
    const hashedPassword = await this.hashGenerator.hash(password)
    const employee = Employee.create({
      name,
      monthWorkedHours,
      email,
      password: hashedPassword,
    })
    await this.employeeRepository.create(employee)
    return right({
      employee,
    })
  }
}
