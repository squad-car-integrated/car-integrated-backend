import { Either, left, right } from '@/core/either'
import { EmployeesRepository } from '../../repositories/employees-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface DeleteEmployeeUseCaseRequest {
  employeeId: string
}
type DeleteEmployeeUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>
@Injectable()
export class DeleteEmployeeUseCase {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    employeeId,
  }: DeleteEmployeeUseCaseRequest): Promise<DeleteEmployeeUseCaseResponse> {
    const employee = await this.employeeRepository.findById(employeeId)
    if (!employee) {
      return left(new ResourceNotFoundError())
    }
    await this.employeeRepository.delete(employee)
    return right({})
  }
}
