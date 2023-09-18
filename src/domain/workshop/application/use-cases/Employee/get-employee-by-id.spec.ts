import { makeEmployee } from 'test/factories/make-employee'
import { GetEmployeeByIdUseCase } from './get-employee-by-id'
import { InMemoryEmployeesRepository } from 'test/repositories/in-memory-employees-repository'

let inMemoryEmployeesRepository: InMemoryEmployeesRepository
let sut: GetEmployeeByIdUseCase

describe('Get Employee By Id', () => {
  beforeEach(() => {
    inMemoryEmployeesRepository = new InMemoryEmployeesRepository()
    sut = new GetEmployeeByIdUseCase(inMemoryEmployeesRepository)
  })

  it('Should be able to get a employee by Id', async () => {
    const newEmployee = makeEmployee({})
    await inMemoryEmployeesRepository.create(newEmployee)
    const result = await sut.execute({
      id: newEmployee.id.toString(),
    })
    expect(result.value).toBeTruthy()
  })
})
