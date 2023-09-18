import { Either, left, right } from '@/core/either'
import { Employee } from '@/domain/workshop/enterprise/entities/employee'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { EmployeesRepository } from '../../repositories/employees-repository'

interface GetEmployeeByIdUseCaseRequest {
  id: string
}
type GetEmployeeByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { employee: Employee }
>
export class GetEmployeeByIdUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    id,
  }: GetEmployeeByIdUseCaseRequest): Promise<GetEmployeeByIdUseCaseResponse> {
    const employee = await this.employeeRepository.findById(id)
    if (!employee) {
      return left(new ResourceNotFoundError())
    }
    return right({
      employee,
    })
  }
}
