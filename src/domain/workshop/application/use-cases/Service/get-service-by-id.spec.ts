import { makeService } from 'test/factories/make-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { GetServiceByIdUseCase } from './get-service-by-id'
import { InMemoryServiceEmployeesRepository } from 'test/repositories/in-memory-service-employees-repository'
import { InMemoryServiceProductsRepository } from 'test/repositories/in-memory-service-products-repository'

let inMemoryServicesRepository: InMemoryServicesRepository
let inMemoryServiceProductsRepository: InMemoryServiceProductsRepository
let inMemoryServiceEmployeesRepository: InMemoryServiceEmployeesRepository
let sut: GetServiceByIdUseCase

describe('Get Service By Id', () => {
  beforeEach(() => {
    inMemoryServiceProductsRepository = new InMemoryServiceProductsRepository()
    inMemoryServiceEmployeesRepository = new InMemoryServiceEmployeesRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryServiceProductsRepository,
      inMemoryServiceEmployeesRepository
    )
    sut = new GetServiceByIdUseCase(inMemoryServicesRepository,inMemoryServiceProductsRepository,inMemoryServiceEmployeesRepository)
  })

  it('Should be able to get a service by id', async () => {
    const newService = makeService({})
    await inMemoryServicesRepository.create(newService)
    const result = await sut.execute({
      id: newService.id.toString(),
    })
    expect(result.value).toBeTruthy()
  })
})
