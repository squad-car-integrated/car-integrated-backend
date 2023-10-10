import { makeEmployee } from 'test/factories/make-employee'
import { GetEmployeeByEmailUseCase } from './get-employee-by-email'
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let sut: GetEmployeeByEmailUseCase

describe('Get Employee By Email', () => {
  beforeEach(() => {
    inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
    sut = new GetEmployeeByEmailUseCase(inMemoryEmployeesRepository)
  })

  it('Should be able to get a employee by Email', async () => {
    const newEmployee = makeEmployee({})
    await inMemoryEmployeesRepository.create(newEmployee)
    const result = await sut.execute({
      email: newEmployee.email.toString(),
    })
    expect(result.value).toBeTruthy()
  })
})
